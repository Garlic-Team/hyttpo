import * as events from 'events';

export class HPromise<T> extends Promise<T> {
    on;
    emit;
    constructor(executor) {
        super(executor);

        const emitter = new events.EventEmitter();
        this.on = emitter.on;
        this.emit = emitter.emit;
    }
}