export interface ObserverEvent {
    message: string;
}

export interface FileProcessingObserver {
    update(event: ObserverEvent): void;
}

export class LoggerObserver implements FileProcessingObserver {
    update(event: ObserverEvent): void {
        console.log(`[LOG] ${event.message}`);
    }
}

export class NotificationObserver implements FileProcessingObserver {
    update(event: ObserverEvent): void {
        console.log(`[NOTIFICATION] ${event.message}`);
    }
}