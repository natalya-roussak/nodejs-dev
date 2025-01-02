import { expect } from 'chai';
import sinon from 'sinon';
import { LoggerObserver, NotificationObserver, FileProcessingObserver, ObserverEvent } from '../src/observer';

describe('FileProcessingObserver Implementations', () => {
    describe('LoggerObserver', () => {
        it('should log the event message with [LOG] prefix', () => {
            const observer: FileProcessingObserver = new LoggerObserver();
            const event: ObserverEvent = { message: 'File processed successfully' };

            const consoleSpy = sinon.spy(console, 'log');
            observer.update(event);

            expect(consoleSpy.calledOnce).to.be.true;
            expect(consoleSpy.calledWith('[LOG] File processed successfully')).to.be.true;

            consoleSpy.restore();
        });
    });

    describe('NotificationObserver', () => {
        it('should log the event message with [NOTIFICATION] prefix', () => {
            const observer: FileProcessingObserver = new NotificationObserver();
            const event: ObserverEvent = { message: 'File uploaded to server' };

            const consoleSpy = sinon.spy(console, 'log');
            observer.update(event);

            expect(consoleSpy.calledOnce).to.be.true;
            expect(consoleSpy.calledWith('[NOTIFICATION] File uploaded to server')).to.be.true;

            consoleSpy.restore();
        });
    });
});
