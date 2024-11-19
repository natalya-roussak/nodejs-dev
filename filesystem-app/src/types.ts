export interface Config {
    watchDirectory: string;
    backupDirectory: string;
    binaryOutputDirectory: string;
    backupRetentionDays: number;
}

export interface Logger {
    log: (message: string) => void;
}
