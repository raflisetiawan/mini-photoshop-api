import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import Jimp from 'jimp';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class ImageProcessingService {
  constructor(private imageService: ImageService) {}

  async convertToBinary(imageName: string): Promise<string> {
    const filePath = this.imageService.getImagePath(imageName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Read the image using Jimp
    const image = await Jimp.read(filePath);

    // Convert the image to binary
    image.grayscale().contrast(1).posterize(2); // Convert to grayscale
    image.threshold({ max: 128 }); // Apply threshold for binary conversion

    // Save the binary image
    const binaryImagePath = this.imageService.saveImage(
      image.bitmap,
      'binary',
      imageName,
    );

    return binaryImagePath;
  }

  async convertToGrayscale(imageName: string): Promise<string> {
    const filePath = this.imageService.getImagePath(imageName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Read the image using Jimp
    const image = await Jimp.read(filePath);

    // Convert the image to grayscale
    image.greyscale();

    // Save the grayscale image
    const grayscaleImagePath = this.imageService.saveImage(
      image,
      'grayscale',
      imageName,
    );

    return grayscaleImagePath;
  }
  async convertToNegative(imageName: string): Promise<string> {
    const filePath = this.imageService.getImagePath(imageName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Read the image using Jimp
    const image = await Jimp.read(filePath);

    // Convert the image to negative
    image.invert();

    // Save the negative image
    const negativeImagePath = this.imageService.saveImage(
      image,
      'negative',
      imageName,
    );

    return negativeImagePath;
  }

  async brightenImage(imageName: string, scalar: number): Promise<string> {
    const filePath = this.imageService.getImagePath(imageName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Read the image using Jimp
    const image = await Jimp.read(filePath);

    // Brighten the image using the scalar value
    image.brightness(scalar);

    // Save the brightened image
    const brightenedImagePath = this.imageService.saveImage(
      image,
      `brightened_${scalar}`,
      imageName,
    );

    return brightenedImagePath;
  }

  async addImages(imageName1: string, imageName2: string): Promise<string> {
    const filePath1 = this.imageService.getImagePath(imageName1);
    const filePath2 = this.imageService.getImagePath(imageName2);

    // Check if the files exist
    if (!fs.existsSync(filePath1) || !fs.existsSync(filePath2)) {
      throw new NotFoundException('One or both images not found');
    }

    // Read the images using Jimp
    const image1 = await Jimp.read(filePath1);
    const image2 = await Jimp.read(filePath2);

    // Check if the dimensions of the images are the same
    if (
      image1.getWidth() !== image2.getWidth() ||
      image1.getHeight() !== image2.getHeight()
    ) {
      throw new Error('Image dimensions must match for addition');
    }

    // Add the images using the composite method
    image1.composite(image2, 0, 0, {
      mode: Jimp.BLEND_OVERLAY,
      opacitySource: 1,
      opacityDest: 1,
    });

    // Save the resulting image
    const addedImagePath = this.imageService.saveImage(
      image1,
      `added_${imageName1}_${imageName2}`,
      `${imageName1}_${imageName2}`,
    );

    return addedImagePath;
  }

  async subtractImages(
    imageName1: string,
    imageName2: string,
  ): Promise<string> {
    const filePath1 = this.imageService.getImagePath(imageName1);
    const filePath2 = this.imageService.getImagePath(imageName2);

    // Check if the files exist
    if (!fs.existsSync(filePath1) || !fs.existsSync(filePath2)) {
      throw new NotFoundException('One or both images not found');
    }

    // Read the images using Jimp
    const image1 = await Jimp.read(filePath1);
    const image2 = await Jimp.read(filePath2);

    // Check if the dimensions of the images are the same
    if (
      image1.getWidth() !== image2.getWidth() ||
      image1.getHeight() !== image2.getHeight()
    ) {
      throw new Error('Image dimensions must match for subtraction');
    }

    // Subtract the images using the composite method with DIFFERENCE mode
    image1.composite(image2, 0, 0, {
      mode: Jimp.BLEND_DIFFERENCE,
      opacitySource: 1,
      opacityDest: 1,
    });

    // Save the resulting image
    const subtractedImagePath = this.imageService.saveImage(
      image1,
      `subtracted_${imageName1}_${imageName2}`,
      `${imageName1}_${imageName2}`,
    );

    return subtractedImagePath;
  }

  async translateImage(
    imageName: string,
    offsetX: number,
    offsetY: number,
  ): Promise<string> {
    const filePath = this.imageService.getImagePath(imageName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Read the image using Jimp
    const image = await Jimp.read(filePath);

    // Create a new image with the same dimensions
    const translatedImage = new Jimp(
      image.getWidth(),
      image.getHeight(),
      0xffffffff,
    ); // 0xffffffff is white

    // Translate the image by copying pixels
    image.scan(0, 0, image.getWidth(), image.getHeight(), (x, y) => {
      const color = image.getPixelColor(x, y);
      translatedImage.setPixelColor(color, x - offsetX, y - offsetY);
    });

    // Extract file extension from the original name
    const fileExtension = imageName.split('.').pop();

    // Save the resulting image with a corrected file name
    const translatedImagePath = this.imageService.saveImage(
      translatedImage,
      `translated_${imageName}`,
      `translated_${imageName}.${fileExtension}`,
    );

    return translatedImagePath;
  }

  async rotateImage(imageName: string, degreesParam: string): Promise<string> {
    const filePath = this.imageService.getImagePath(imageName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Parse the degrees parameter to ensure it's a number
    const degrees = parseFloat(degreesParam);

    // Check if degrees is a valid number
    if (isNaN(degrees)) {
      throw new BadRequestException(
        'Invalid degrees value. It must be a number.',
      );
    }

    // Read the image using Jimp
    const image = await Jimp.read(filePath);

    // Rotate the image
    image.rotate(degrees);

    // Save the resulting image
    const rotatedImagePath = this.imageService.saveImage(
      image,
      `rotated_${imageName}`,
      `${imageName}`,
    );

    return rotatedImagePath;
  }

  async flipImage(imageName: string, axis: string): Promise<string> {
    const filePath = this.imageService.getImagePath(imageName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Read the image using Jimp
    const image = await Jimp.read(filePath);

    // Flip the image based on the specified axis
    if (axis === 'horizontal') {
      image.flip(true, false);
    } else if (axis === 'vertical') {
      image.flip(false, true);
    } else {
      throw new BadRequestException(
        'Invalid axis value. Use "horizontal" or "vertical".',
      );
    }

    // Extract file extension from the original name
    const fileExtension = imageName.split('.').pop();

    // Save the resulting image with a corrected file name
    const flippedImagePath = this.imageService.saveImage(
      image,
      `flipped_${axis}_${imageName}`,
      `flipped_${axis}_${imageName}.${fileExtension}`,
    );

    return flippedImagePath;
  }

  async zoomImage(imageName: string, factor: number): Promise<string> {
    const filePath = this.imageService.getImagePath(imageName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Read the image using Jimp
    const image = await Jimp.read(filePath);

    // Calculate new dimensions based on the zoom factor
    const newWidth = Math.round(image.getWidth() * factor);
    const newHeight = Math.round(image.getHeight() * factor);

    // Resize the image
    image.resize(newWidth, newHeight);

    // Save the resulting image
    const zoomedImagePath = this.imageService.saveImage(
      image,
      `zoomed_${imageName}`,
      `${imageName}`,
    );

    return zoomedImagePath;
  }

  async getHistogram(imageName: string): Promise<number[]> {
    const filePath = this.imageService.getImagePath(imageName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Read the image using Jimp
    const image = await Jimp.read(filePath);

    // Initialize histogram array
    const histogram = Array(256).fill(0);

    // Calculate histogram
    image.scan(0, 0, image.getWidth(), image.getHeight(), (x, y) => {
      const pixelValue = Jimp.intToRGBA(image.getPixelColor(x, y)).r;
      histogram[pixelValue]++;
    });

    return histogram;
  }

  async getNormalizedHistogram(imageName: string): Promise<number[]> {
    const histogram = await this.getHistogram(imageName);

    // Calculate the total number of pixels
    const totalPixels = histogram.reduce((acc, count) => acc + count, 0);

    // Normalize the histogram
    const normalizedHistogram = histogram.map((count) => count / totalPixels);

    return normalizedHistogram;
  }

  async applyHistogramEqualization(
    imageName: string,
  ): Promise<{ imagePath: string; histogram: number[] }> {
    const filePath = this.imageService.getImagePath(imageName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Read the image using Jimp
    const image = await Jimp.read(filePath);

    // Get the histogram
    const histogram = await this.getHistogram(imageName);

    // Get the cumulative distribution function (CDF)
    const cdf = histogram.reduce((acc, count, index) => {
      acc[index] = (acc[index - 1] || 0) + count;
      return acc;
    }, []);

    // Normalize the CDF
    const normalizedCdf = cdf.map((value) => value / cdf[cdf.length - 1]);

    // Equalize the image
    image.scan(0, 0, image.getWidth(), image.getHeight(), (x, y) => {
      const pixelValue = Jimp.intToRGBA(image.getPixelColor(x, y)).r;
      const equalizedValue = Math.round(normalizedCdf[pixelValue] * 255);
      const color = Jimp.rgbaToInt(
        equalizedValue,
        equalizedValue,
        equalizedValue,
        255,
      );
      image.setPixelColor(color, x, y);
    });

    // Save the equalized image
    const equalizedImagePath = this.imageService.saveImage(
      image,
      `equalized_${imageName}`,
      `${imageName}`,
    );

    return { imagePath: equalizedImagePath, histogram };
  }
}
