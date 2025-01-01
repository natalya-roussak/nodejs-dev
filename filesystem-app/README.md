# File Backup, Compression, and Binary Data Processing Service

This Node.js service provides functionality to monitor a directory for new files, create backups, compress those backups, and process the files by reversing their binary data. It handles errors gracefully and logs actions and errors to a log file.

## Features

- **File Monitoring**: Monitors a directory for new files.
- **Backup Creation**: Copies the file to a designated backup directory.
- **Compression**: Compresses the backup using gzip compression.
- **Binary Data Transformation**: Reverses the byte order of the file's binary data and saves it to a separate file.
- **Error Handling**: Logs errors and ensures the service continues running smoothly.
- **Cleanup**: Deletes backups older than a specified number of days to avoid indefinite growth.

## Requirements

- Node.js (version >= 16.x)
- npm or yarn for managing dependencies
- TypeScript (if not already installed, it will be installed as part of the project)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configuration

You can configure the service using the `config.json` file located in the root of the project. Below is an example configuration:

```json
{
  "watchDirectory": "./input", 
  "backupDirectory": "./backup",
  "binaryOutputDirectory": "./output",
  "logFilePath": "./log.txt",
  "cleanupDays": 30
}
```

- `watchDirectory`: The directory where new files will be monitored.
- `backupDirectory`: The directory where backups will be stored.
- `binaryOutputDirectory`: The directory where transformed binary files will be saved.
- `logFilePath`: The path to the log file where all actions and errors will be logged. 
- `cleanupDays`: The number of days after which backups will be deleted.

## Usage

### 1. Start the Service

To start the file monitoring service, run the following command:

```bash
npm start
```

This will begin monitoring the `watchDirectoryForChanges` for new files. When a new file is added, the following steps will be executed automatically:

- The file is copied to the `backupDirectory`.
- The backup file is compressed using gzip.
- The binary data of the file is reversed and saved to the `binaryOutputDirectory` as a new file with a `-reversed.bin` suffix.

### 2. Cleanup Old Backups
The cleanup process automatically runs every 24 hours to delete backup files that are older than the specified number of days (cleanupDays), as defined in the config.json file.

The service continuously watches the directory for changes and, every 24 hours, runs the cleanup to remove old backup files. The cleanup logic deletes any files in the backupDirectory that exceed the age limit specified in config.json.

For example, if you have the following configuration in config.json:

```json
{
  "backupDirectory": "./backup",
  "cleanupDays": 30
}
```
Any backup files in the ./backup directory that are older than 30 days will be automatically deleted during each cleanup cycle.

## Testing

### 1. Run Tests

You can run unit tests for the service using Mocha and Chai:

```bash
npm test
```

This command will run all the tests in the `test` directory. The tests cover various aspects of the functionality, including file backup, compression, binary data transformation, and error handling.

### 2. Running Tests Individually

If you want to run tests for specific files or functions, you can specify the test files like this:

```bash
npm run mocha -- dist/test/unit/compression.spec.js
```

This will run only the tests for compression.

## Directory Structure

```
fs-app/
├── dist/                  # Compiled JavaScript files (after running `tsc`)
├── src/                   # Source code
│   ├── backup.ts          # Handles file backup, compression, and binary transformation
│   ├── compression.ts     # Compression utility
│   ├── binaryProcessor.ts # Binary data processing utility
│   ├── logger.ts          # Logger utility
│   ├── index.ts           # Main entry point of the service
├── test/                   # Unit tests
│   ├── unit/
│   │   ├── backup.spec.ts  # Tests for backup functionality
│   │   ├── compression.spec.ts  # Tests for compression functionality
│   │   ├── binaryProcessor.spec.ts # Tests for binary data processing functionality
├── config.json             # Configuration file
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration file
└── README.md               # Documentation
```
