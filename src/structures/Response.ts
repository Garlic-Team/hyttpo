import { Redirect } from '../util/constants';

export class Response {
    request: object;
    status: number;
    statusText: string;
    headers: object;
    data: string;
    responseUrl: string;
    redirects: Array<Redirect>;
    constructor(options) {
        this.request = options.request;

        this.status = options.status;
        this.statusText = options.statusText;

        this.headers = options.headers;
        this.data = options.data;

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
