import fs from 'fs';
import path from 'path';
import { Logger } from './logger';
import config from '../config.json';

export async function transformBinaryData(filePath: string): Promise<void> {
  const fileBuffer = await fs.promises.readFile(filePath);
  const fileName = path.basename(filePath, path.extname(filePath));
  const reversedBuffer = Buffer.from(fileBuffer).reverse();
  const outputPath = path.join(config.binaryOutputDirectory, `${fileName}-reversed.bin`);

  await fs.promises.writeFile(outputPath, reversedBuffer);
  Logger.log(`Binary data transformed and saved to: ${outputPath}`);
}
