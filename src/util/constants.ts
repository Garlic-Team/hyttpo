import { Response } from '../structures/Response';

export type ResponseType = 'stream' | 'arraybuffer' | 'buffer' | 'text' | 'json' | 'blob';
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

export interface PayloadRequestAliases {
    url?: string;
    body?: any;
    headers?: object;
    responseType?: ResponseType;
    responseEncoding?: BufferEncoding;
    maxContentLength?: number;
    trackRedirects?: boolean;
    maxRedirects?: number;
    maxBodyLength?: number;
    agent?: any;
    httpsAgent?: any;
    httpAgent?: any;
    onEnd?: (any) => void;
    onData?: (Buffer) => void;
    onError?: (string) => void;
    onResponse?: (Response) => void;
    onDownloadProgress?: (any) => void;
    onUploadProgress?: (any) => void;
}

export interface PayloadRequest {
    method: PayloadMethod;
    url: string;
    body?: any;
    headers?: object;
    responseType?: ResponseType;
    responseEncoding?: BufferEncoding;
    maxContentLength?: number;
    trackRedirects?: boolean;
    maxRedirects?: number;
    maxBodyLength?: number;
    agent?: any;
    httpsAgent?: any;
    httpAgent?: any;
    onEnd?: (any) => void;
    onData?: (Buffer) => void;
    onError?: (string) => void;
    onResponse?: (Response) => void;
    onDownloadProgress?: (any) => void;
    onUploadProgress?: (any) => void;
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

export interface ResponseOptions {
    request?: object;
    statusCode?: number;
    statusMessage?: string;
    headers?: object;
    data?: any;
    responseUrl?: string;
    redirects?: Array<Redirect>;
}


export interface HPromiseEvents {
    end: any;
    data: Buffer;
    error: string;
    response: Response;
    downloadProgress: any;
    uploadProgress: any;
}
