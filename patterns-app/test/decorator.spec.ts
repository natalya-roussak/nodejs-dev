import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import { FileProcessor, LoggingDecorator, CachingDecorator } from '../src/decorator';
import { TransformationStrategy } from '../src/strategy';

describe('FileProcessor and Decorators', () => {
    let readFileSyncStub: sinon.SinonStub;
    let mockStrategy: TransformationStrategy;

    beforeEach(() => {
        readFileSyncStub = sinon.stub(fs, 'readFileSync');
        mockStrategy = { execute: () => "" };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('FileProcessor', () => {
        it('should read a file and process it with the provided strategy', () => {
            const filePath = 'test.txt';
            const fileContent = 'hello world';
            const transformedContent = 'HELLO WORLD';

            readFileSyncStub.withArgs(filePath, 'utf-8').returns(fileContent);
            sinon.stub(mockStrategy, 'execute').withArgs(fileContent).returns(transformedContent);

            const processor = new FileProcessor();
            const result = processor.process(filePath, mockStrategy);

            expect(result).to.equal(transformedContent);
            expect(readFileSyncStub.calledOnceWith(filePath, 'utf-8')).to.be.true;
            expect((mockStrategy.execute as sinon.SinonStub).calledOnceWith(fileContent)).to.be.true;
        });
    });

    describe('LoggingDecorator', () => {
        it('should log processing time and process the file', () => {
            const filePath = 'test.txt';
            const fileContent = 'hello world';
            const transformedContent = 'HELLO WORLD';

            readFileSyncStub.withArgs(filePath, 'utf-8').returns(fileContent);
            sinon.stub(mockStrategy, 'execute').withArgs(fileContent).returns(transformedContent);

            const baseProcessor = new FileProcessor();
            const loggingProcessor = new LoggingDecorator(baseProcessor);

            const consoleTimeSpy = sinon.spy(console, 'time');
            const consoleTimeEndSpy = sinon.spy(console, 'timeEnd');

            const result = loggingProcessor.process(filePath, mockStrategy);

            expect(result).to.equal(transformedContent);
            expect(consoleTimeSpy.calledOnceWith('Processing Time')).to.be.true;
            expect(consoleTimeEndSpy.calledOnceWith('Processing Time')).to.be.true;
        });
    });

    describe('CachingDecorator', () => {
        it('should cache the result of the file processing', () => {
            const filePath = 'test.txt';
            const fileContent = 'hello world';
            const transformedContent = 'HELLO WORLD';

            readFileSyncStub.withArgs(filePath, 'utf-8').returns(fileContent);
            sinon.stub(mockStrategy, 'execute').withArgs(fileContent).returns(transformedContent);

            const baseProcessor = new FileProcessor();
            const cachingProcessor = new CachingDecorator(baseProcessor);

            const result1 = cachingProcessor.process(filePath, mockStrategy);
            expect(result1).to.equal(transformedContent);

            const consoleSpy = sinon.spy(console, 'log');
            const result2 = cachingProcessor.process(filePath, mockStrategy);
            expect(result2).to.equal(transformedContent);

            expect(consoleSpy.calledOnceWith('[CACHE] Returning cached result.')).to.be.true;
        });
    });
});
