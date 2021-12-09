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
    | 'SEARCH';

export interface PayloadRequest {
    method: PayloadMethod;
    url: string;
    body?: string;
    responseType?: ResponseType;
    responseEncoding?: BufferEncoding;
    maxContentLength?: number;
    headers?: object;
}
