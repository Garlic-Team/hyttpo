export type ResponseType = 'stream' | 'arraybuffer' | 'buffer' | 'text';
export type PayloadMethod =
    | 'GET'
    | 'POST'
    | 'PATCH'
    | 'PUT'
    | 'TRACE'
    | 'HEAD'
    | 'OPTIONS'
    | 'CONNECT'
    | 'DELETE'
    | 'SEARCH'
    | 'PURGE'
    | 'LINK'
    | 'UNLINK';

export interface PayloadRequest {
    method: PayloadMethod;
    url: string;
    body?: string;
    headers?: object;
    responseType?: ResponseType;
    responseEncoding?: BufferEncoding;
    maxContentLength?: number;
    trackRedirects?: boolean;
    maxRedirects?: number;
    maxBodyLength?: number;
}

export interface RequestOptions {
    path?: string;
    method?: PayloadMethod;
    headers?: object;
    hostname?: string;
    port?: string;
    agent?: object;
    maxRedirects?: number;
    trackRedirects?: boolean;
    maxBodyLength?: number;
}

export interface Redirect {
    url: string;
    statusCode: number;
    headers?: object;
}
