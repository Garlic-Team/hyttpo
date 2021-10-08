declare module 'hyttpo' {
    export class Hyttpo {
        public request(data: PayloadRequest | string): Response;
        public get(data: PayloadMethod | string): Response;
        public post(data: PayloadMethod | string): Response;
        public patch(data: PayloadMethod | string): Response;
        public delete(data: PayloadMethod | string): Response;
    }

    export class Response {
        public request: object;

        public status: number;
        public statusText: string;

        public headers: object;
        public data: object;

        public ok: boolean;
        public json(): object;
        public text(): string;
        public buffer(): Buffer;
    }

    interface PayloadRequest {
        method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
        url: string;
        headers?: object;
        body?: object;
    }

    interface PayloadMethod {
        url: string;
        headers?: object;
        body?: object;
    }
}