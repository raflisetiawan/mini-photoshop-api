import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Image } from 'image-js';
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
    const fileBuffer = fs.readFileSync(filePath);
    const image = await Image.load(fileBuffer);

    return {
      width: image.width,
      height: image.height,
      fileSize: image.size / 1024,
      bitsPerPixel: image.bitDepth,
    };
  }
  getAllImageNames(): string[] {
    const uploadDir = './uploads';
    // Read all files in the upload directory and filter out non-image files
    const files = fs
      .readdirSync(uploadDir)
      .filter((file) => this.isImageFile(file));
    return files;
  }

  async getAllImages(): Promise<any> {
    const uploadDir = './uploads';
    const files = this.getAllImageNames();

    const imageBuffers: any[] = [];

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      imageBuffers.push({ file: fileBuffer, name: file });
    }

    return imageBuffers;
  }

  private isImageFile(file: string): boolean {
    // Add logic to determine if the file is an image (you can use file extensions)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  }
}
