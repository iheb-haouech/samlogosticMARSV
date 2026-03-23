import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { UploadPodService } from './upload-pod.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadPodResponseDto } from './dto/upload-pod.dto';

const UPLOADED_FILES_PATH = './uploadedFiles';

@ApiTags('upload-pod')
@Controller('upload-pod')
export class UploadPodController {
  constructor(
    private readonly uploadPodService: UploadPodService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('upload-pod')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload POD' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        order_id: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'POD uploaded successfully',
    type: UploadPodResponseDto, // Use the response DTO here
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADED_FILES_PATH,
        filename: (req, file, callback) => {
          const order_id = req.body.order_id;
          if (!order_id) {
            return callback(new Error('Order ID is required'), null);
          }
          const fileExt = file.originalname.split('.').pop();
          const newFileName = `POD-${order_id}.${fileExt}`;
          callback(null, newFileName);
        },
      }),
    }),
  )
  async uploadFile(
    @Body('order_id') order_id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
          new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Res() res,
  ) {
    console.log('Received order_id:', order_id);

    try {
      // Check if the order exists
      const orderExists = await this.prisma.order.findUnique({
        where: { id: order_id },
      });

      if (!orderExists) {
        return res.status(404).json({ message: 'Order does not exist' });
      }

      // Construct a relative path for the podUrl
      const podUrl = `/upload-pod/download-pod/files/${file.filename}`;

      // Check if a POD record already exists for the order
      const existingPod = await this.prisma.order_pod.findFirst({
        where: { orderId: order_id },
      });

      let podRecord;
      if (existingPod) {
        // Update the existing POD record
        podRecord = await this.prisma.order_pod.update({
          where: { id: existingPod.id },
          data: { podUrl: podUrl },
        });
      } else {
        // Create a new POD record
        podRecord = await this.prisma.order_pod.create({
          data: {
            orderId: order_id,
            podUrl: podUrl,
          },
        });
      }

      return res.status(200).json({
        message: 'POD uploaded successfully',
        podUrl: podUrl,
        pod: podRecord,
      });
    } catch (error) {
      console.error('Error uploading POD:', error);
      return res
        .status(500)
        .json({ message: error.message || 'An error occurred' });
    }
  }

  @Get('download-pod/files/:filepath')
  //@ApiBearerAuth()
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Visualize uploaded file' })
  seeUploadedFile(@Param('filepath') file: string, @Res() res) {
    return res.sendFile(file, { root: UPLOADED_FILES_PATH });
  }
}
