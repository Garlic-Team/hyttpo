class Response {
    constructor(options) {
        this.request = options.request;

        this.status = options.status;
        this.statusText = options.statusText;

        this.headers = options.headers;
        this.data = options.data;
    }

    get ok() {
        return this.status >= 200 && this.status <= 300;
    }

    json() {
        return JSON.parse(this.data);
    }

    text() {
        return this.data.toString();
    }

    array() {
        return this.data.toString().split('\n');
    }

    buffer() {
        return Buffer.from(this.data);
    }
}

module.exports = Response;
