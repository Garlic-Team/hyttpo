import * as https from 'https';
import * as http from 'http';
import * as zlib from 'zlib';
import Utils from './utils';
import Response from './structures/Response';
const methods = ['GET', 'POST', 'PATCH', 'PUT', 'TRACE', 'HEAD', 'OPTIONS', 'CONNECT', 'DELETE'];

type ResponseType = 'stream' | 'arraybuffer' | 'buffer' | 'text';

enum PayloadMethod {
    'GET',
    'POST',
    'PATCH',
    'PUT',
    'TRACE',
    'HEAD',
    'OPTIONS',
    'CONNECT',
    'DELETE',
}

interface PayloadRequest {
    method: PayloadMethod;
    url: string;
    body?: string;
    responseType?: ResponseType;
    headers?: object;
}

class Hyttpo {
    constructor() {
        methods.forEach(method => {
            this[method.toLocaleLowerCase()] = (data) => {
                if(typeof data === 'string') data = { url: data };

                return this.rawRequest({ method: method, ...data })
            }
        })
    }

    request(data: PayloadRequest): Promise<Response> {
        if(typeof data !== 'object') throw Error('It must be an object!');
        return this.rawRequest(data)
    }

    rawRequest(data): Promise<Response> {
        return new Promise((resolve, reject) => {
            let url = new URL(data.url);
            let isHttps: boolean = !!(url.protocol === 'https:');

            let request: any = isHttps ? https : http;
            let method: PayloadMethod = data.method.toUpperCase();
    
            let body = data.body;

            let headers = data.headers || {};
            if (!headers['Accept']) headers['Accept'] = 'application/json, text/plain, */*';
            if (!headers['User-Agent']) headers['User-Agent'] = 'riso/nodejs'
    
            if(['POST', 'PATCH', 'PUT', 'TRACE', 'HEAD', 'OPTIONS', 'CONNECT', 'DELETE'].includes(method.toString())) request = request.request;
            else request = request[method.toString().toLowerCase()];

            let agent = isHttps ? data.httpsAgent || data.agent : data.httpAgent || data.agent

            let requestOptions = {
                path: `${url.pathname}${url.search}`,
                method: method,
                headers: headers,
                hostname: url.hostname,
                port: url.port,
                agent: agent
            }

            let req = request(requestOptions, (res) => {
                let lastRequest = req.req || req;
                let stream = res;

                if(res.statusCode !== 204 && lastRequest.method !== 'HEAD') {
                    switch(res.headers['content-encoding']) {
                        case 'gzip':
                        case 'compress':
                        case 'deflate':
                            stream = stream.pipe(zlib.createUnzip())

                            delete res.headers['content-encoding'];
                            break;
                    }
                }

                let response = {
                    request: res,
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    headers: res.headers,
                    data: null
                }

                if(data.responseType === 'stream') {
                    response.data = stream;
                    
                    let final = new Response(response);
                    if (final.ok) resolve(final);
                    else reject(final);
                } else {
                    let buffer: any = [];

                    stream.on('data', (chunk) => {
                        buffer.push(chunk);
                    })

                    stream.on('error', (error) => {
                        if (req.aborted) return;
                        reject(error);
                    })

                    stream.on('end', () => {
                        buffer = Buffer.concat(buffer);

                        if (!['arraybuffer', 'buffer'].includes(data.responseType)) {
                            buffer = Utils.responseRefactor(buffer);
                        }

                        response.data = buffer;

                        let final = new Response(response);
                        if (final.ok) resolve(final);
                        else reject(final);
                    })
                }
            })

            req.on('error', (error) => {
                if (req.aborted && error.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
                reject(error);
            })

            if(body && method !== PayloadMethod.GET) {
                if(Utils.isObject(body) && (body?.constructor?.name === 'FormData' || Utils.isStream(body))) {
                    body.pipe(req)
                } else {
                    req.write(body);
                    req.end();
                }
            }
        })
    }
}

export default Hyttpo;