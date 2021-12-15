import Utils from '../util/utils';
import { Response } from '../structures/Response';
import { PayloadRequest, PayloadRequestAliases } from '../util/constants';
import { HPromise } from '../structures/HPromise';
import { httpAdapter } from '../adapters/node/httpAdapter';
import { xmlAdapter } from '../adapters/browser/xmlAdapter';

const methods = ['GET', 'POST', 'PATCH', 'PUT', 'TRACE', 'HEAD', 'OPTIONS', 'CONNECT', 'DELETE', 'SEARCH', 'PURGE', 'LINK', 'UNLINK'];

export class Hyttpo {
    constructor() {
        methods.forEach(method => {
            this[method.toLocaleLowerCase()] = (url, data: PayloadRequestAliases) => {
                if (typeof url === 'object') data = url;
                if (!data.url) data.url = url;

                return this.rawRequest({ method: method, ...data });
            };
        });
    }

    public request(data: PayloadRequest): HPromise<Response> {
        if (typeof data !== 'object') throw Error('It must be an object!');

        return this.rawRequest(data);
    }

    private rawRequest(data): HPromise<Response> {
        data = Utils.dataConfigParse(data);

        if (typeof XMLHttpRequest !== 'undefined') {
            return xmlAdapter(data);
        } else {
           return httpAdapter(data, methods);
        }
    }

    /* eslint-disable  @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, no-unused-vars, @typescript-eslint/no-empty-function, no-empty-function */
    // @ts-ignore
    get(url: string, data?: PayloadRequest): HPromise<Response> {}
    // @ts-ignore
    post(url: string, data?: PayloadRequest): HPromise<Response> {}
    // @ts-ignore
    patch(url: string, data?: PayloadRequest): HPromise<Response> {}
    // @ts-ignore
    put(url: string, data?: PayloadRequest): HPromise<Response> {}
    // @ts-ignore
    trace(url: string, data?: PayloadRequest): HPromise<Response> {}
    // @ts-ignore
    head(url: string, data?: PayloadRequest): HPromise<Response> {}
    // @ts-ignore
    options(url: string, data?: PayloadRequest): HPromise<Response> {}
    // @ts-ignore
    connect(url: string, data?: PayloadRequest): HPromise<Response> {}
    // @ts-ignore
    delete(url: string, data?: PayloadRequest): HPromise<Response> {}
    // @ts-ignore
    search(url: string, data?: PayloadRequest): HPromise<Response> {}
    // @ts-ignore
    purge(url: string, data?: PayloadRequest): HPromise<Response> {}
    // @ts-ignore
    link(url: string, data?: PayloadRequest): HPromise<Response> {}
    // @ts-ignore
    unlink(url: string, data?: PayloadRequest): HPromise<Response> {}
}
