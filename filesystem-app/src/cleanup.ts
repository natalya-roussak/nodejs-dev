import fs from 'fs';
import path from 'path';
import config from '../config.json';
import { Logger } from './logger';

export async function cleanupOldBackups(): Promise<void> {
    const backupDir = config.backupDirectory;
    const retentionPeriod = config.backupRetentionDays * 24 * 60 * 60 * 1000;
    const files = await fs.promises.readdir(backupDir);

    const now = Date.now();
    for (const file of files) {
        const filePath = path.join(backupDir, file);
        const stats = await fs.promises.stat(filePath);

        if (now - stats.mtimeMs > retentionPeriod) {
            await fs.promises.unlink(filePath);
            Logger.log(`Deleted old backup: ${file}`);
        }
    }
}
