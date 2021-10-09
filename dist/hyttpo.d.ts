import Response from './structures/Response';
declare type PayloadMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'TRACE' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'DELETE';
declare type ResponseType = 'stream' | 'arraybuffer' | 'buffer' | 'text';
interface PayloadRequest {
    method: PayloadMethod;
    url: string;
    body?: object | string;
    responseType?: ResponseType;
    headers?: object;
}
declare class Hyttpo {
    constructor();
    request(data: PayloadRequest): Promise<Response>;
    rawRequest(data: any): Promise<Response>;
}
export default Hyttpo;
