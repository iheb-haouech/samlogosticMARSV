import { ApiProperty } from '@nestjs/swagger';

export class UploadPodResponseDto {
  @ApiProperty({
    description: 'The filename of the uploaded POD',
    example: 'POD-order-id-12345.jpg',
  })
  filename: string;

  @ApiProperty({
    description: 'The MIME type of the uploaded file',
    example: 'image/jpeg',
  })
  type: string;

  @ApiProperty({
    description: 'The URL to access the uploaded POD file',
    example: 'http://example.com/uploadedFiles/POD-order-id-12345.jpg',
  })
  podUrl: string;
}
