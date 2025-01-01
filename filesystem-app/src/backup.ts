import fs from 'fs';
import path from 'path';
import { compressFile } from './compression';
import { transformBinaryData } from './binaryProcessor';
import { Logger } from './logger';
import config from '../config.json';

export async function handleNewFile(filePath: string): Promise<void> {
  const backupDir = config.backupDirectory;
  const fileName = path.basename(filePath);
  const backupPath = path.join(backupDir, fileName);

  try {
    await fs.promises.copyFile(filePath, backupPath);
    Logger.log(`Backup created for file: ${fileName}`);

    await compressFile(backupPath);
    await transformBinaryData(filePath);
  } catch (error) {
    Logger.log(`Error handling file: ${error}`);
  }
}
