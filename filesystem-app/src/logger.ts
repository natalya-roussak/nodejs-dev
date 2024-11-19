import fs from 'fs';
import config from '../config.json';

const logFilePath = config.logFilePath;

export class Logger {
  static log(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFilePath, logMessage);
  }
}
