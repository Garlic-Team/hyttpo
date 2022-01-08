import * as events from 'events';
import { HPromiseEvents } from '../util/constants';

export class HPromise<T> extends Promise<T> {
	private _on;
	private _emit;
	constructor(executor) {
		super(executor);

		const emitter = new events.EventEmitter();
		this._on = emitter.on;
		this._emit = emitter.emit;
	}

	// eslint-disable-next-line no-unused-vars
	on<K extends keyof HPromiseEvents>(event: K, listener: (args: HPromiseEvents[K]) => void) {
		return this._on(event, listener);
	}

	emit(name, ...args) {
		return this._emit(name, ...args);
	}
}
