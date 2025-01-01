import fs from 'fs';
import path from 'path';
import { handleNewFile } from './backup';
import { Logger } from './logger';
import config from '../config.json';

const watchDirectory = config.watchDirectory;

export function watchDirectoryForChanges(): void {
  if (!fs.existsSync(watchDirectory)) {
    console.error(`Watch directory does not exist: ${watchDirectory}`);
    process.exit(1);
  }

  fs.watch(watchDirectory, async (eventType, filename) => {
    if (eventType === 'rename' && filename) {
      const filePath = path.join(watchDirectory, filename);
      if (fs.existsSync(filePath)) {
        Logger.log(`New file detected: ${filename}`);
        await handleNewFile(filePath);
      }
    }
  });

  console.log(`Watching for changes in: ${watchDirectory}`);
}
