// backend/src/pdf-generator/pdf-generator.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'html-pdf';
import * as puppeteer from 'puppeteer'; // ✅ AJOUTER

@Injectable()
export class PdfGeneratorService {
  // ✅ AJOUTER ces 2 propriétés
  private readonly templatesPath = path.join(__dirname, '../../templates');
  private readonly outputPath = path.join(__dirname, '../../generated-pdfs');

  constructor(private prisma: PrismaService) {}

  async generatePdf(
    data: any,
    templateName: string,
    savedFileName: string,
    save: boolean = false,
  ): Promise<Buffer> {
    try {
      // Lire le template HTML
      const htmlPath = path.join(__dirname, '../../templates', templateName);
      const html = fs.readFileSync(htmlPath, 'utf-8');

      // Compiler le template
      const template = handlebars.compile(html);
      const compiledHtml = template(data);

      // Générer le PDF
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

      // Sauvegarder si nécessaire
      if (save) {
      const filePath = path.join(
        __dirname,
        '../../generated-pdfs',
        savedFileName,
      );
      fs.writeFileSync(filePath, pdfBuffer as any); // ✅ Cast en any
      }

      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  async generateShippingLabel(
    labelData: any,
  ): Promise<{ path: string; filename: string }> {
    const templatePath = path.join(this.templatesPath, 'label.hbs');

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template introuvable: ${templatePath}`);
    }

    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateContent);

    const htmlContent = template({
      companyName: 'SAM LOGISTIC',
      companyWebsite: 'samlogistic.tn',

      trackingId: labelData.trackingId,

      recipientName: labelData.recipient.companyName || 'N/A',
      recipientAddress: labelData.recipient.streetAddress || '',
      recipientCity: labelData.recipient.city || '',
      recipientZipCode: labelData.recipient.zipCode || '',
      recipientCountry: labelData.recipient.country || 'Tunisie',
      recipientPhone: labelData.recipient.phone || '',

      senderName: labelData.sender.companyName || 'N/A',
      senderAddress: labelData.sender.streetAddress || '',
      senderCity: labelData.sender.city || '',
      senderZipCode: labelData.sender.zipCode || '',

      totalWeight: labelData.totalWeight || 0,
      packageCount: labelData.packages?.length || 0,
      shippingDate: new Date(labelData.shippingDate).toLocaleDateString(
        'fr-FR',
      ),
      serviceType: 'Standard',
    });

    const filename = `label-${labelData.trackingId}-${Date.now()}.pdf`;
    const filepath = await this.htmlToPdf(htmlContent, filename);

    return { path: filepath, filename };
  }

  private async htmlToPdf(
    htmlContent: string,
    filename: string,
  ): Promise<string> {
    let browser;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      const pdfPath = path.join(this.outputPath, filename);

      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      return pdfPath;
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async generateInvoice(orderId: string, res: any): Promise<void> {
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
        deliveredBy: true,
      },
    });

    const templateName = 'invoice.hbs';
    const savedFileName = `invoice-${order.trackingId}.pdf`;

    const pdfBuffer = await this.generatePdf(
      {
        ...order,
        createdAt: `${order.createdAt.getDate()}/${order.createdAt.getMonth() + 1}/${order.createdAt.getFullYear()}`,
      },
      templateName,
      savedFileName,
      true,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  }

  async generateLabel(orderId: string, res: any): Promise<void> {
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

    const templateName = 'etiquette-commande.hbs';
    const savedFileName = `label-${order.trackingId}.pdf`;

    const pdfBuffer = await this.generatePdf(
      {
        ...order,
        references: order?.refrences,
        createdAt: `${order?.createdAt?.getDate()}/${order?.createdAt?.getMonth()}/${order?.createdAt?.getFullYear()}`,
        startTransitAt: order?.startTransitAt
          ? `${order.startTransitAt.getDate()}/${order.startTransitAt.getMonth()}/${order.startTransitAt.getFullYear()}`
          : null,
        packagesLength: order?.packages?.length,
        packages: order?.packages?.map((pkg: any) => ({
          ...pkg,
          totalPrice: pkg?.quantity * pkg?.price,
        })),
        source: {
          ...order?.source,
          companyName: order?.source?.companyName?.toUpperCase(),
        },
        recipient: {
          ...order?.recipient,
          companyName: order?.recipient?.companyName?.toUpperCase(),
        },
      },
      templateName,
      savedFileName,
      true,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  }
}
