import { Module } from '@nestjs/common';
import { ImageController } from './image/image.controller';
import { ImageService } from './image/image.service';
import { ImageProcessingController } from './image-processing/image-processing.controller';
import { ImageProcessingService } from './image-processing/image-processing.service';

@Module({
  imports: [],
  controllers: [ImageController, ImageProcessingController],
  providers: [ImageService, ImageProcessingService],
})
export class AppModule {}
