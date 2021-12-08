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
    | 'DELETE';

export interface PayloadRequest {
    method: PayloadMethod;
    url: string;
    body?: string;
    responseType?: ResponseType;
    headers?: object;
}
