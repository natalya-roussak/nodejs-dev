import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { handleNewFile } from '../../src/backup';
import * as compressionModule from '../../src/compression';
import * as binaryProcessorModule from '../../src/binaryProcessor';
import { Logger } from '../../src/logger';

describe('handleNewFile', () => {
  const testFilePath = './watch/testfile.txt';
  const backupDir = './backup';
  const backupPath = path.join(backupDir, 'testfile.txt');

  let copyFileStub: sinon.SinonStub;
  let compressFileStub: sinon.SinonStub;
  let transformBinaryDataStub: sinon.SinonStub;
  let loggerStub: sinon.SinonStub;

  beforeEach(() => {
    copyFileStub = sinon.stub(fs.promises, 'copyFile').resolves();
    compressFileStub = sinon.stub(compressionModule, 'compressFile').resolves();
    transformBinaryDataStub = sinon.stub(binaryProcessorModule, 'transformBinaryData').resolves();
    loggerStub = sinon.stub(Logger, 'log');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should copy the file to the backup directory', async () => {
    await handleNewFile(testFilePath);

    expect(copyFileStub.calledOnceWith(testFilePath, backupPath)).to.be.true;
    expect(loggerStub.calledWith(`Backup created for file: testfile.txt`)).to.be.true;
  });

  it('should compress the copied file', async () => {
    await handleNewFile(testFilePath);

    expect(compressFileStub.calledOnceWith(backupPath)).to.be.true;
  });

  it('should transform the binary data of the original file', async () => {
    await handleNewFile(testFilePath);

    expect(transformBinaryDataStub.calledOnceWith(testFilePath)).to.be.true;
  });

  it('should log an error if copying the file fails', async () => {
    const errorMessage = 'Copy failed';
    copyFileStub.rejects(new Error(errorMessage));

    await handleNewFile(testFilePath);

    expect(loggerStub.calledWithMatch(`Error handling file: Error: ${errorMessage}`)).to.be.true;
  });

  it('should log an error if compression fails', async () => {
    const errorMessage = 'Compression failed';
    compressFileStub.rejects(new Error(errorMessage));

    await handleNewFile(testFilePath);

    expect(loggerStub.calledWithMatch(`Error handling file: Error: ${errorMessage}`)).to.be.true;
  });

  it('should log an error if binary transformation fails', async () => {
    const errorMessage = 'Binary transformation failed';
    transformBinaryDataStub.rejects(new Error(errorMessage));

    await handleNewFile(testFilePath);

    expect(loggerStub.calledWithMatch(`Error handling file: Error: ${errorMessage}`)).to.be.true;
  });
});
