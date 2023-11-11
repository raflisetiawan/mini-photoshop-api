import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.imageService.saveImage(
      file.buffer,
      'uploaded',
      file.originalname,
    );
  }

  @Get(':imageName')
  async getImage(@Param('imageName') imageName: string): Promise<any> {
    // Return the image based on the file name
    return this.imageService.getImage(imageName);
  }

  @Get(':imageName/info')
  async getImageInfo(@Param('imageName') imageName: string): Promise<any> {
    // Get information about the image (width, height, file size, bits per pixel)
    return this.imageService.getImageInfo(imageName);
  }
}
