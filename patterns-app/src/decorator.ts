import * as fs from 'fs';
import { TransformationStrategy } from './strategy';

export class FileProcessor {
    process(filePath: string, strategy: TransformationStrategy): string {
        const content = fs.readFileSync(filePath, 'utf-8');
        return strategy.execute(content);
    }
}

export class LoggingDecorator {
    private processor: FileProcessor;

    constructor(processor: FileProcessor) {
        this.processor = processor;
    }

    process(filePath: string, strategy: TransformationStrategy): string {
        console.time('Processing Time');
        const result = this.processor.process(filePath, strategy);
        console.timeEnd('Processing Time');
        return result;
    }
}

export class CachingDecorator {
    private processor: FileProcessor;
    private cache: Map<string, string>;

    constructor(processor: FileProcessor) {
        this.processor = processor;
        this.cache = new Map();
    }

    process(filePath: string, strategy: TransformationStrategy): string {
        const cacheKey = `${filePath}_${strategy.constructor.name}`;
        if (this.cache.has(cacheKey)) {
            console.log('[CACHE] Returning cached result.');
            return this.cache.get(cacheKey) as string;
        }

        const result = this.processor.process(filePath, strategy);
        this.cache.set(cacheKey, result);
        return result;
    }
}