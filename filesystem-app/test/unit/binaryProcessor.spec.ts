import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { transformBinaryData } from '../../src/binaryProcessor';
import { Logger } from '../../src/logger';

describe('transformBinaryData', () => {
  const testFilePath = './testfile.bin';
  const fileName = 'testfile';
  const outputDir = "./bin";
  const outputPath = path.join(outputDir, `${fileName}-reversed.bin`);
  
  let readFileStub: sinon.SinonStub;
  let writeFileStub: sinon.SinonStub;
  let logStub: sinon.SinonStub;

  beforeEach(() => {
    readFileStub = sinon.stub(fs.promises, 'readFile');
    writeFileStub = sinon.stub(fs.promises, 'writeFile');
    logStub = sinon.stub(Logger, 'log');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should read the file, reverse the binary data, and save it to the output directory', async () => {
    const inputBuffer = Buffer.from([1, 2, 3, 4, 5]);
    const reversedBuffer = Buffer.from([5, 4, 3, 2, 1]);

    readFileStub.resolves(inputBuffer);

    writeFileStub.resolves();

    await transformBinaryData(testFilePath);

    expect(readFileStub.calledOnceWith(testFilePath)).to.be.true;
    expect(writeFileStub.calledOnceWith(outputPath, reversedBuffer)).to.be.true;
    expect(logStub.calledOnceWith(`Binary data transformed and saved to: ${outputPath}`)).to.be.true;
  });

  it('should handle errors during file reading', async () => {
    const error = new Error('File read error');
    
    readFileStub.rejects(error);

    try {
      await transformBinaryData(testFilePath);
    } catch (err) {
      expect(readFileStub.calledOnceWith(testFilePath)).to.be.true;
      expect(err).to.equal(error);
      expect(logStub.called).to.be.false;
    }
  });

  it('should handle errors during file writing', async () => {
    const inputBuffer = Buffer.from([1, 2, 3, 4, 5]);
    const reversedBuffer = Buffer.from([5, 4, 3, 2, 1]);
    const error = new Error('File write error');

    readFileStub.resolves(inputBuffer);

    writeFileStub.rejects(error);

    try {
      await transformBinaryData(testFilePath);
    } catch (err) {
      expect(readFileStub.calledOnceWith(testFilePath)).to.be.true;
      expect(writeFileStub.calledOnceWith(outputPath, reversedBuffer)).to.be.true;
      expect(err).to.equal(error);
      expect(logStub.called).to.be.false;
    }
  });
});
