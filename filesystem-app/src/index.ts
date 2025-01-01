import { cleanupOldBackups } from './cleanup';
import { watchDirectoryForChanges } from './watcher';

watchDirectoryForChanges();

setInterval(() => {
    cleanupOldBackups();
}, 24 * 60 * 60 * 1000);
