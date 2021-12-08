import * as https from 'https';
import * as http from 'http';
import * as zlib from 'zlib';
import Utils from '../util/utils';
import { Response } from '../structures/Response';
import { PayloadMethod, PayloadRequest } from '../util/constants';
const methods = ['GET', 'POST', 'PATCH', 'PUT', 'TRACE', 'HEAD', 'OPTIONS', 'CONNECT', 'DELETE'];

export class Hyttpo {
    constructor() {
        methods.forEach(method => {
            this[method.toLocaleLowerCase()] = data => {
                if (typeof data === 'string') data = { url: data };

                return this.rawRequest({ method: method, ...data });
            };
        });
    }

    request(data: PayloadRequest): Promise<Response> {
        if (typeof data !== 'object') throw Error('It must be an object!');
        return this.rawRequest(data);
    }

    rawRequest(data): Promise<Response> {
        return new Promise((resolve, reject) => {
            const url = new URL(data.url);
            const isHttps = !!(url.protocol === 'https:');

            let request: any = isHttps ? https : http;
            const method: PayloadMethod = data.method.toUpperCase();

            const body = data.body;

            const headers = data.headers || {};
            if (!headers.Accept) headers.Accept = 'application/json, text/plain, */*';
            if (!headers['User-Agent']) headers['User-Agent'] = 'hyttpo/nodejs';

            if (['POST', 'PATCH', 'PUT', 'TRACE', 'HEAD', 'OPTIONS', 'CONNECT', 'DELETE'].includes(method)) request = request.request;
            else request = request[method.toLowerCase()];

            const agent = isHttps ? data.httpsAgent || data.agent : data.httpAgent || data.agent;

            const requestOptions = {
                path: `${url.pathname}${url.search}`,
                method: method,
                headers: headers,
                hostname: url.hostname,
                port: url.port,
                agent: agent,
            };

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

                const response = {
                    request: res,
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    headers: res.headers,
                    data: null,
                };

                if (data.responseType === 'stream') {
                    response.data = stream;

                    const final = new Response(response);
                    if (final.ok) resolve(final);
                    else reject(final);
                } else {
                    let buffer: any = [];

                    stream.on('data', chunk => {
                        buffer.push(chunk);
                    });

                    stream.on('error', error => {
                        if (req.aborted) return;
                        reject(error);
                    });

                    stream.on('end', () => {
                        buffer = Buffer.concat(buffer);

                        if (!['arraybuffer', 'buffer'].includes(data.responseType)) {
                            buffer = Utils.responseRefactor(buffer);
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
}
