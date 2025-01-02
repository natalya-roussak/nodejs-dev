import { expect } from 'chai';
import { TransformationStrategy, UpperCaseStrategy, ReverseTextStrategy, WordCountStrategy } from '../src/strategy';

describe('Transformation Strategies', () => {
    describe('UpperCaseStrategy', () => {
        it('should convert text to uppercase', () => {
            const strategy: TransformationStrategy = new UpperCaseStrategy();
            const input = 'hello world';
            const output = strategy.execute(input);
            expect(output).to.equal('HELLO WORLD');
        });
    });

    describe('ReverseTextStrategy', () => {
        it('should reverse the text', () => {
            const strategy: TransformationStrategy = new ReverseTextStrategy();
            const input = 'hello world';
            const output = strategy.execute(input);
            expect(output).to.equal('dlrow olleh');
        });
    });

    describe('WordCountStrategy', () => {
        it('should count the number of words in the text', () => {
            const strategy: TransformationStrategy = new WordCountStrategy();
            const input = 'hello world from mocha chai';
            const output = strategy.execute(input);
            expect(output).to.equal('Word Count: 5');
        });

        it('should return zero for empty text', () => {
            const strategy: TransformationStrategy = new WordCountStrategy();
            const input = '    ';
            const output = strategy.execute(input);
            expect(output).to.equal('Word Count: 0');
        });

        it('should handle text with multiple spaces', () => {
            const strategy: TransformationStrategy = new WordCountStrategy();
            const input = 'hello     world';
            const output = strategy.execute(input);
            expect(output).to.equal('Word Count: 2');
        });
    });

    describe('Error Handling', () => {
        it('should throw an error if the input is not a string', () => {
            const strategy: TransformationStrategy = new UpperCaseStrategy();
            const invalidInput: any = null;
            expect(() => strategy.execute(invalidInput)).to.throw(TypeError);
        });
    });
});
