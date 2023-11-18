import { Controller, Get, Param, Query } from '@nestjs/common';
import { ImageFilterService } from './image-filter.service';

@Controller('image-filter')
export class ImageFilterController {
  constructor(private readonly imageFilterService: ImageFilterService) {}

  @Get('median/:imageName')
  async applyMedianFilter(
    @Param('imageName') imageName: string,
    @Query('size') size: number,
  ): Promise<any> {
    // Return the image based on the file name
    return this.imageFilterService.applyMedianFilter(imageName, size);
  }
}
