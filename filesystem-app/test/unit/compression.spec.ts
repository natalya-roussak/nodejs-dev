import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import zlib, { Gzip } from 'zlib';
import { Logger } from '../../src/logger';
import { compressFile } from '../../src/compression';

describe('compressFile', () => {
    let createReadStreamStub: sinon.SinonStub;
    let createWriteStreamStub: sinon.SinonStub;
    let createGzipStub: sinon.SinonStub;
    let loggerSpy: sinon.SinonStub;

    beforeEach(() => {
        loggerSpy = sinon.stub(Logger, 'log');
        loggerSpy.callsFake(() => { });

        createReadStreamStub = sinon.stub(fs, 'createReadStream');
        createWriteStreamStub = sinon.stub(fs, 'createWriteStream');

        createGzipStub = sinon.stub(zlib, 'createGzip').returns({
            pipe: sinon.stub().returns({
                on: sinon.stub().callsFake((event: string, callback: Function) => {
                    if (event === 'finish') {
                        callback();
                    }
                    if (event === 'error') {
                        callback(new Error('Compression failed'));
                    }
                })
            })
        } as unknown as Gzip);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should compress the file successfully', async () => {
        const filePath = 'test.txt';

        const mockSourceStream = { pipe: sinon.stub() };
        const mockDestinationStream = { on: sinon.stub() };

        mockSourceStream.pipe.returns({
            pipe: sinon.stub().returns(mockDestinationStream),
        });

        createReadStreamStub.withArgs(filePath).returns(mockSourceStream as any);
        createWriteStreamStub.withArgs(`${filePath}.gz`).returns(mockDestinationStream as any);

        mockDestinationStream.on.withArgs('finish').yields();

        await compressFile(filePath);

        expect(createReadStreamStub.calledOnceWithExactly(filePath)).to.be.true;
        expect(createWriteStreamStub.calledOnceWithExactly(`${filePath}.gz`)).to.be.true;
        expect(createGzipStub.calledOnce).to.be.true;
        expect(mockSourceStream.pipe.calledOnce).to.be.true;
        expect(mockDestinationStream.on.calledOnce).to.be.true;
        expect(loggerSpy.calledOnceWithExactly(`File compressed: ${filePath}`)).to.be.true;
    });

    it('should handle errors during compression', async () => {
        const filePath = 'test.txt';

        const mockSourceStream = { pipe: sinon.stub() };
        const mockDestinationStream = { on: sinon.stub() };

        mockSourceStream.pipe.returns({
            pipe: sinon.stub().returns(mockDestinationStream),
        });

        createReadStreamStub.withArgs(filePath).returns(mockSourceStream as any);
        createWriteStreamStub.withArgs(`${filePath}.gz`).returns(mockDestinationStream as any);

        const error = new Error('Compression failed');
        mockDestinationStream.on.withArgs('finish').returns(mockDestinationStream);
        mockDestinationStream.on.withArgs('error').yields(error);

        try {
            await compressFile(filePath);
            expect.fail('Expected error not thrown');
        } catch (err) {
            expect(err).to.equal(error);
            expect(loggerSpy.notCalled).to.be.true;
        }
    });
});
