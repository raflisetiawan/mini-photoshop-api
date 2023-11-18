import { Controller, Get, Param, ParseFloatPipe, Query } from '@nestjs/common';
import { ImageProcessingService } from './image-processing.service';

@Controller('image-processing')
export class ImageProcessingController {
  constructor(
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  @Get('convert-binary/:imageName')
  async getImage(@Param('imageName') imageName: string): Promise<any> {
    // Return the image based on the file name
    return this.imageProcessingService.convertToBinary(imageName);
  }

  @Get('convert-grayscale/:imageName')
  async convertToGrayscale(
    @Param('imageName') imageName: string,
  ): Promise<any> {
    return this.imageProcessingService.convertToGrayscale(imageName);
  }

  @Get('convert-negative/:imageName')
  async convertToNegative(@Param('imageName') imageName: string): Promise<any> {
    return this.imageProcessingService.convertToNegative(imageName);
  }
  @Get('brighten-image/:imageName/:scalar')
  async brightenImage(
    @Param('imageName') imageName: string,
    @Param('scalar', ParseFloatPipe) scalar: number,
  ): Promise<any> {
    return this.imageProcessingService.brightenImage(imageName, scalar);
  }

  @Get('add-images/:imageName1/:imageName2')
  async addImages(
    @Param('imageName1') imageName1: string,
    @Param('imageName2') imageName2: string,
  ): Promise<any> {
    return this.imageProcessingService.addImages(imageName1, imageName2);
  }

  @Get('subtract-images/:imageName1/:imageName2')
  async subtractImages(
    @Param('imageName1') imageName1: string,
    @Param('imageName2') imageName2: string,
  ): Promise<any> {
    return this.imageProcessingService.subtractImages(imageName1, imageName2);
  }

  @Get('translate-image/:imageName')
  async translateImage(
    @Param('imageName') imageName: string,
    @Query('offsetX') offsetX: number,
    @Query('offsetY') offsetY: number,
  ): Promise<any> {
    // Return the translated image based on the file name and offset values
    return this.imageProcessingService.translateImage(
      imageName,
      offsetX,
      offsetY,
    );
  }

  @Get('rotate-image/:imageName')
  async rotateImage(
    @Param('imageName') imageName: string,
    @Query('degrees') degrees: string,
  ): Promise<any> {
    // Return the rotated image based on the file name and degrees value
    return this.imageProcessingService.rotateImage(imageName, degrees);
  }

  @Get('flip-image/:imageName')
  async flipImage(
    @Param('imageName') imageName: string,
    @Query('axis') axis: string,
  ): Promise<any> {
    // Return the flipped image based on the file name and axis value
    return this.imageProcessingService.flipImage(imageName, axis);
  }

  @Get('zoom-image/:imageName')
  async zoomImage(
    @Param('imageName') imageName: string,
    @Query('factor') factor: number,
  ): Promise<any> {
    // Return the zoomed image based on the file name and zoom factor
    return this.imageProcessingService.zoomImage(imageName, factor);
  }

  @Get('histogram/:imageName')
  async getHistogram(@Param('imageName') imageName: string): Promise<number[]> {
    return this.imageProcessingService.getHistogram(imageName);
  }

  @Get('normalized-histogram/:imageName')
  async getNormalizedHistogram(
    @Param('imageName') imageName: string,
  ): Promise<number[]> {
    return this.imageProcessingService.getNormalizedHistogram(imageName);
  }

  @Get('equalize-histogram/:imageName')
  async applyHistogramEqualization(
    @Param('imageName') imageName: string,
  ): Promise<{ imagePath: string; histogram: number[] }> {
    return this.imageProcessingService.applyHistogramEqualization(imageName);
  }
}
