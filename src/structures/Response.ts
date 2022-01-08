import { Redirect, ResponseOptions } from '../util/constants';

export class Response {
	public request?: object;
	public status?: number;
	public statusText?: string;
	public headers?: object;
	public data?: any;
	public responseUrl?: string;
	public redirects?: Array<Redirect>;
	constructor(options?: ResponseOptions) {
		if ('request' in options) this.request = options.request;

		if ('statusCode' in options) this.status = options.statusCode;
		if ('statusMessage' in options) this.statusText = options.statusMessage;

		if ('headers' in options) this.headers = options.headers;
		if ('data' in options) this.data = options.data;

		if ('responseUrl' in options) this.responseUrl = options.responseUrl;
		if ('redirects' in options) this.redirects = options.redirects;
	}

	get ok(): boolean {
		return this.status >= 200 && this.status <= 300;
	}

	get statusCode(): number {
		return this.status;
	}

	get statusMessage(): string {
		return this.statusText;
	}

	json(): object {
		return typeof this.data !== 'object' ? JSON.parse(this.data) : this.data;
	}

	text(): string {
		return this.data.toString();
	}

	array(): Array<string> {
		return this.data.toString().split('\n');
	}

	buffer(): Buffer {
		return Buffer.from(this.data);
	}
}
