import { Module } from '@nestjs/common';
import { ImageController } from './image/image.controller';
import { ImageService } from './image/image.service';
import { ImageProcessingController } from './image-processing/image-processing.controller';
import { ImageProcessingService } from './image-processing/image-processing.service';
import { ImageFilterController } from './image-filter/image-filter.controller';
import { ImageFilterService } from './image-filter/image-filter.service';

@Module({
  imports: [],
  controllers: [ImageController, ImageProcessingController, ImageFilterController],
  providers: [ImageService, ImageProcessingService, ImageFilterService],
})
export class AppModule {}
