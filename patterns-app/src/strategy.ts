export interface TransformationStrategy {
    execute(content: string): string;
}

export class UpperCaseStrategy implements TransformationStrategy {
    execute(content: string): string {
        return content.toUpperCase();
    }
}

export class ReverseTextStrategy implements TransformationStrategy {
    execute(content: string): string {
        return content.split('').reverse().join('');
    }
}

export class WordCountStrategy implements TransformationStrategy {
    execute(content: string): string {
        const wordCount = content.split(/\s+/).filter(Boolean).length;
        return `Word Count: ${wordCount}`;
    }
}