import * as https from 'https';
import * as http from 'http';
import * as follwoRedirects from 'follow-redirects';
import * as zlib from 'zlib';
import { Blob } from 'buffer';
import Utils from '../../util/utils';
import { Response } from '../../structures/Response';
import { PayloadMethod, PayloadRequest, RequestOptions } from '../../util/constants';
import { HPromise } from '../../structures/HPromise';

export const httpAdapter = (data: PayloadRequest, methods: Array<string>): HPromise<Response> => {
    let resolves;
    let rejects;

    const promise: any = new HPromise((resolve, reject) => {
        resolves = resolve;
        rejects = reject;
    });

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

    const method: PayloadMethod = data.method.toUpperCase() as PayloadMethod;

    const body = data.body;

    const headers: any = data.headers || {};
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

                    data.responseType = 'stream';
                    delete res.headers['content-encoding'];
                    break;
            }
        }

        const response = new Response({
            request: res,
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
        });

        if (data.trackRedirects) {
            response.responseUrl = res.responseUrl;
            response.redirects = res.redirects;
        }

        if (data.responseType === 'stream') {
            stream.on('data', chunk => {
                promise.emit('data', chunk);
                data.onData?.(chunk);
            });
            stream.on('end', () => {
                promise.emit('end', stream);
                data.onEnd?.(stream);
            });

            response.data = stream;

            if (response.ok) resolves(response);
            else rejects(response);
        } else {
            let buffer: any = [];

            stream.on('data', chunk => {
                promise.emit('data', chunk);
                data.onData?.(chunk);
                buffer.push(chunk);

                if (data.maxContentLength > -1 && Buffer.concat(buffer).length > data.maxContentLength) {
                    stream.destroy();

                    data.onError?.(`maxContentLength (${data.maxContentLength}) exceeded`);
                    promise.emit('error', `maxContentLength (${data.maxContentLength}) exceeded`);
                    rejects(new Error(`maxContentLength (${data.maxContentLength}) exceeded`));
                }
            });

            stream.on('error', error => {
                if (req.aborted) return;

                data.onError?.(error);
                promise.emit('error', error);
                rejects(error);
            });

            stream.on('end', () => {
                buffer = Buffer.concat(buffer);

                if (!['arraybuffer', 'buffer'].includes(data.responseType)) {
                    buffer = Utils.responseRefactor(buffer, data.responseEncoding);

                    if (data.responseType === 'blob') buffer = new Blob([Utils.toString(buffer)]);
                } else if (data.responseType === 'arraybuffer') {
                    buffer = Utils.toArrayBuffer(buffer);
                }

                response.data = buffer;

                data.onEnd?.({ buffer, response });
                promise.emit('end', { buffer, response });
                if (response.ok) resolves(response);
                else rejects(response);
            });
        }
    });

    req.on('error', error => {
        if (req.aborted && error.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;

        data.onError?.(error);
        promise.emit('error', error);
        rejects(error);
    });

    req.on('response', message => {
        promise.emit('response', new Response(message)) 
        data.onResponse?.(new Response(message))
    });

    if (body && method !== 'GET') {
        if (Utils.isObject(body) && (body?.constructor?.name === 'FormData' || Utils.isStream(body))) {
            body.pipe(req);
        } else {
            req.write(body);
            req.end();
        }
    }

    return promise as HPromise<Response>;
};
