import * as https from 'https';
import * as http from 'http';
import * as follwoRedirects from 'follow-redirects';
import * as zlib from 'zlib';
import Utils from '../util/utils';
import { Response } from '../structures/Response';
import { PayloadMethod, PayloadRequest, RequestOptions } from '../util/constants';

const methods = ['GET', 'POST', 'PATCH', 'PUT', 'TRACE', 'HEAD', 'OPTIONS', 'CONNECT', 'DELETE', 'SEARCH'];

export class Hyttpo {
    constructor() {
        methods.forEach(method => {
            this[method.toLocaleLowerCase()] = data => {
                if (typeof data === 'string') data = { url: data };

                return this.rawRequest({ method: method, ...data });
            };
        });
    }

    public request(data: PayloadRequest): Promise<Response> {
        if (typeof data !== 'object') throw Error('It must be an object!');
        return this.rawRequest(data);
    }

    private rawRequest(data): Promise<Response> {
        return new Promise((resolve, reject) => {
            data = Utils.dataConfigParse(data);

            const url = new URL(data.url);
            const isHttps = !!(url.protocol === 'https:');

            const requestOptions: RequestOptions = {};

            let request: any;
            if (data.maxRedirects === 0) {
                request = isHttps ? https : http;
            } else {
                requestOptions.maxRedirects = data.maxRedirects;
                requestOptions.trackRedirects = data.trackRedirects;

                request = isHttps ? follwoRedirects.https : follwoRedirects.http;
            }

            const method: PayloadMethod = data.method.toUpperCase();

            const body = data.body;

            const headers = data.headers || {};
            if (!headers.Accept) headers.Accept = 'application/json, text/plain, */*';
            if (!headers['User-Agent']) headers['User-Agent'] = 'hyttpo/nodejs (+https://github.com/Garlic-Team/hyttpo)';

            if (methods.includes(method) && method !== 'GET') request = request.request;
            else request = request[method.toLowerCase()];

            const agent = isHttps ? data.httpsAgent || data.agent : data.httpAgent || data.agent;

            requestOptions.path = `${url.pathname}${url.search}`;
            requestOptions.method = method;
            requestOptions.headers = headers;
            requestOptions.hostname = url.hostname;
            requestOptions.port = url.port;
            requestOptions.agent = agent;

            if (data.maxBodyLength > -1) requestOptions.maxBodyLength = data.maxBodyLength;

            const req = request(requestOptions, res => {
                const lastRequest = req.req || req;
                let stream = res;

                if (res.statusCode !== 204 && lastRequest.method !== 'HEAD') {
                    switch (res.headers['content-encoding']) {
                        case 'gzip':
                        case 'compress':
                        case 'deflate':
                            stream = stream.pipe(zlib.createUnzip());

                            delete res.headers['content-encoding'];
                            break;
                    }
                }

                const response: any = {
                    request: res,
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    headers: res.headers,
                    data: null,
                };

                if (data.trackRedirects) {
                    response.responseUrl = res.responseUrl;
                    response.redirects = res.redirects;
                }

                if (data.responseType === 'stream') {
                    response.data = stream;

                    const final = new Response(response);
                    if (final.ok) resolve(final);
                    else reject(final);
                } else {
                    let buffer: any = [];

                    stream.on('data', chunk => {
                        buffer.push(chunk);

                        if (data.maxContentLength > -1 && Buffer.concat(buffer).length > data.maxContentLength) {
                            stream.destroy();
                            reject(new Error(`maxContentLength (${data.maxContentLength}) exceeded`));
                        }
                    });

                    stream.on('error', error => {
                        if (req.aborted) return;
                        reject(error);
                    });

                    stream.on('end', () => {
                        buffer = Buffer.concat(buffer);

                        if (!['arraybuffer', 'buffer'].includes(data.responseType)) {
                            buffer = Utils.responseRefactor(buffer, data.responseEncoding);
                        } else if (data.responseType === 'arraybuffer') {
                            buffer = new Uint32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Uint32Array.BYTES_PER_ELEMENT).buffer;
                        }

                        response.data = buffer;

                        const final = new Response(response);
                        if (final.ok) resolve(final);
                        else reject(final);
                    });
                }
            });

            req.on('error', error => {
                if (req.aborted && error.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
                reject(error);
            });

            if (body && method !== 'GET') {
                if (Utils.isObject(body) && (body?.constructor?.name === 'FormData' || Utils.isStream(body))) {
                    body.pipe(req);
                } else {
                    req.write(body);
                    req.end();
                }
            }
        });
    }

    /* eslint-disable  @typescript-eslint/no-unused-vars, no-unused-vars, @typescript-eslint/no-empty-function, no-empty-function */
    get(url: string, data?: PayloadRequest) {}
    post(url: string, data?: PayloadRequest) {}
    patch(url: string, data?: PayloadRequest) {}
    put(url: string, data?: PayloadRequest) {}
    trace(url: string, data?: PayloadRequest) {}
    head(url: string, data?: PayloadRequest) {}
    options(url: string, data?: PayloadRequest) {}
    connect(url: string, data?: PayloadRequest) {}
    delete(url: string, data?: PayloadRequest) {}
    search(url: string, data?: PayloadRequest) {}
}
