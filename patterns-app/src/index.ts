import * as fs from 'fs';
import * as path from "path";
import EventEmitter from "events";
import { CachingDecorator, FileProcessor, LoggingDecorator } from './decorator';
import { LoggerObserver, NotificationObserver } from './observer';
import { ReverseTextStrategy, TransformationStrategy, UpperCaseStrategy, WordCountStrategy } from './strategy';

class FileProcessorSystem extends EventEmitter {
    private inputDir: string;
    private outputDir: string;
    private processor: FileProcessor;

    constructor(inputDir: string, outputDir: string) {
        super();
        this.inputDir = inputDir;
        this.outputDir = outputDir;
        this.processor = new LoggingDecorator(new CachingDecorator(new FileProcessor()));
    }

    processFiles(strategy: TransformationStrategy): void {
        fs.readdirSync(this.inputDir).forEach(file => {
            const inputFilePath = path.join(this.inputDir, file);
            const outputFilePath = path.join(this.outputDir, file);

            try {

                const transformedContent = this.processor.process(inputFilePath, strategy);

                fs.writeFileSync(outputFilePath, transformedContent);
                this.emit('fileProcessed', { message: `Processed file: ${file}` });
            } catch (error) {
                this.emit('error', { message: `Error processing file: ${file}, Error: ${(error as Error).message}` });
            }
        });
    }
}

function main(): void {
    const inputDir = path.resolve('./input');
    const outputDir = path.resolve('./output');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const system = new FileProcessorSystem(inputDir, outputDir);

    const logger = new LoggerObserver();
    const notifier = new NotificationObserver();

    system.on('fileProcessed', event => logger.update(event));
    system.on('fileProcessed', event => notifier.update(event));
    system.on('error', event => logger.update(event));

    const upperCaseStrategy = new UpperCaseStrategy();
    const reverseTextStrategy = new ReverseTextStrategy();
    const wordCountStrategy = new WordCountStrategy();

    system.processFiles(upperCaseStrategy);

    // Cache example
    system.processFiles(upperCaseStrategy);


    //system.processFiles(reverseTextStrategy);
    //system.processFiles(wordCountStrategy);
}

main();