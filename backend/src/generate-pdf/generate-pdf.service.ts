import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as pdf from 'html-pdf';
import * as path from 'path';
import * as fs from 'fs';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeneratePdfService {
  constructor(private prisma: PrismaService) {}

  private async generateQRCodeDataUrl(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text);
    } catch (err) {
      console.error('QR generation error:', err);
      return '';
    }
  }
  async generatePdf(
    data: any,
    template_name: string,
    saved_file_name: string,
    save: boolean = false,
  ): Promise<Buffer> {
    try {
      // Read HTML template file
      const htmlPath = path.join(__dirname, '../../templates', template_name);
      const html = fs.readFileSync(htmlPath, 'utf-8');

      // Compile HTML template
      const template = handlebars.compile(html);

      // Inject data into template
      const compiledHtml = template(data);

      // Convert HTML to PDF buffer
      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        pdf.create(compiledHtml).toBuffer((err, buffer) => {
          if (err) {
            console.error('PDF Creation Error:', err);
            reject(err);
          } else {
            resolve(buffer);
          }
        });
      });

      // Save generated PDF buffer in pdf file if save is true
      if (save) {
        const filePath = path.join(
          __dirname,
          '../../../generatedFiles',
          saved_file_name,
        );
        await fs.writeFileSync(filePath, pdfBuffer as any, { flag: 'w' });
      }

      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  async generateEtiquette(orderId: string, res: any, save: boolean = false) {
    try {
      const order: any = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          source: true,
          recipient: true,
          packages: {
            include: {
              references: true,
            },
          },
          deliveredBy: {
            include: {
              disponibility: true,
            },
          },
        },
      });

      const packagesWithQr = await Promise.all(
        (order?.packages || []).map(async (pkg) => {
          const qrText = pkg?.qrCode || `${order?.trackingId || order?.id}-pkg${pkg?.id || ''}`;
          const qrDataUrl = await this.generateQRCodeDataUrl(qrText);
          return {
            ...pkg,
            totalPrice: (pkg?.quantity || 0) * (pkg?.price || 0),
            qrDataUrl,
          };
        }),
      );

      const template_name = 'etiquette-commande.hbs';
      const saved_file_name = 'output.pdf';
      const pdfBuffer = await this.generatePdf(
        {
          ...order,
          references: order?.refrences,
          createdAt: `${order?.createdAt?.getDate()}/${order?.createdAt?.getMonth()}/${order?.createdAt?.getFullYear()}`,
          startTransitAt: order?.startTransitAt
            ? `${order.startTransitAt.getDate()}/${order.startTransitAt.getMonth()}/${order.startTransitAt.getFullYear()}`
            : '-',
          packagesLength: packagesWithQr.length,
          packages: packagesWithQr,
          source: {
            ...order?.source,
            companyName: order?.source?.companyName?.toUpperCase(),
          },
          recipient: {
            ...order?.recipient,
            companyName: order?.recipient?.companyName?.toUpperCase(),
          },
        },
        template_name,
        saved_file_name,
        save,
      );
      console.log(order);

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');

      // Send the PDF buffer as response
      return res.send(pdfBuffer);
    } catch (error) {
      console.log(error);
    }
  }
}
