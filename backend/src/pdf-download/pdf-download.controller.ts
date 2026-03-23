// backend/src/pdf-download/pdf-download.controller.ts
import { Controller, Get, Param, Res, HttpException } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('downloads')
export class PdfDownloadController {
  private readonly pdfPath = path.join(__dirname, '../../generated-pdfs');

  @Get(':filename')
  downloadPdf(@Param('filename') filename: string, @Res() res: Response) {
    // Sécurité: vérifier que le nom de fichier est valide (PDF uniquement)
    const pdfRegex = /^[a-zA-Z0-9_-]+\.pdf$/;
    if (!pdfRegex.test(filename)) {
      throw new HttpException('Nom de fichier invalide', 400);
    }

    const filepath = path.join(this.pdfPath, filename);

    // Vérifier si le fichier existe
    if (!fs.existsSync(filepath)) {
      throw new HttpException('Fichier introuvable', 404);
    }

    // Envoyer le fichier
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  }

  @Get('view/:filename')
  viewPdf(@Param('filename') filename: string, @Res() res: Response) {
    // Pour visualiser le PDF dans le navigateur
    const pdfRegex = /^[a-zA-Z0-9_-]+\.pdf$/;
    if (!pdfRegex.test(filename)) {
      throw new HttpException('Nom de fichier invalide', 400);
    }

    const filepath = path.join(this.pdfPath, filename);

    if (!fs.existsSync(filepath)) {
      throw new HttpException('Fichier introuvable', 404);
    }

    // Afficher dans le navigateur au lieu de télécharger
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  }
}
