import { Redirect } from '../util/constants';

export class Response {
    public request?: object;
    public status?: number;
    public statusText?: string;
    public headers?: object;
    public data?: string;
    public responseUrl?: string;
    public redirects?: Array<Redirect>;
    constructor(options?) {
        if ('request' in options) this.request = options.request;

        if ('status' in options) this.status = options.status;
        if ('statusText' in options) this.statusText = options.statusText;

        if ('headers' in options) this.headers = options.headers;
        if ('data' in options) this.data = options.data;

        if ('responseUrl' in options) this.responseUrl = options.responseUrl;
        if ('redirects' in options) this.redirects = options.redirects;
    }

    get ok(): boolean {
        return this.status >= 200 && this.status <= 300;
    }

    json(): object {
        return JSON.parse(this.data);
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
