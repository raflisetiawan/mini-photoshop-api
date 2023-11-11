import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import imageSize from 'image-size';
import Jimp from 'jimp';

@Injectable()
export class ImageService {
  public saveImage(bitmap: any, type: string, originalName: string): string {
    const uploadDir = './uploads';
    const fileName = `${type}_${originalName}`;
    const filePath = path.join(uploadDir, fileName);

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Use Jimp to write the image
    Jimp.read(bitmap)
      .then((image) => {
        return image.write(filePath);
      })
      .catch((error) => {
        throw new Error(`Error saving image: ${error.message}`);
      });

    return filePath;
  }

  public getImagePath(imageName: string): string {
    const uploadDir = './uploads';
    return path.join(uploadDir, imageName);
  }

  async getImage(imageName: string): Promise<Buffer> {
    const uploadDir = './uploads'; // Specify the directory where images are saved
    const filePath = path.join(uploadDir, imageName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Read the file and return its buffer
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer;
  }

  async getImageInfo(imageName: string): Promise<any> {
    const uploadDir = './uploads'; // Specify the directory where images are saved
    const filePath = path.join(uploadDir, imageName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    // Get image dimensions using the image-size library
    const dimensions = imageSize(filePath);

    // Get file size in bytes
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;

    // Calculate bits per pixel (This might need more sophisticated logic based on image format)
    const bitsPerPixel = Math.ceil(
      (fileSizeInBytes * 8) / (dimensions.width * dimensions.height),
    );

    return {
      width: dimensions.width,
      height: dimensions.height,
      fileSize: fileSizeInBytes,
      bitsPerPixel: bitsPerPixel,
    };
  }
}
