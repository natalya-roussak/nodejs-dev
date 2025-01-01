import fs from 'fs';
import zlib from 'zlib';
import { Logger } from './logger';

export async function compressFile(filePath: string): Promise<void> {
  const gzip = zlib.createGzip();
  const source = fs.createReadStream(filePath);
  const destination = fs.createWriteStream(`${filePath}.gz`);

  return new Promise((resolve, reject) => {
    source.pipe(gzip).pipe(destination)
      .on('finish', () => {
        Logger.log(`File compressed: ${filePath}`);
        resolve();
      })
      .on('error', (err) => reject(err));
  });
}
