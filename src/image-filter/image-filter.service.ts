import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { ImageService } from 'src/image/image.service';
import * as fs from 'fs';

@Injectable()
export class ImageFilterService {
  constructor(private imageService: ImageService) {}

  async applyMedianFilter(imageName: string, size: number): Promise<string> {
    try {
      const filePath = this.imageService.getImagePath(imageName);

      // Read the image file as a buffer
      const inputBuffer = fs.readFileSync(filePath);
      // Apply the median filter with a specified radius
      const outputBuffer = await sharp(inputBuffer)
        .median(parseInt(size.toString())) // You can adjust the size parameter based on the desired filter radius
        .toBuffer();

      // Save or return the filtered image
      const filteredImageName = `filtered_${imageName}`;
      await sharp(outputBuffer).toFile(`uploads/${filteredImageName}`);

      return filteredImageName;
    } catch (error) {
      // Handle errors appropriately (e.g., log or throw)
      console.error('Error applying median filter:', error.message);
      throw new Error('Error applying median filter');
    }
  }
}
