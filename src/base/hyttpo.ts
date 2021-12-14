import Utils from '../util/utils';
import { Response } from '../structures/Response';
import { PayloadRequest } from '../util/constants';
import { HPromise } from '../structures/HPromise';
import { httpAdapter } from '../adapters/node/httpAdapter';
import { xmlAdapter } from '../adapters/browser/xmlAdapter';

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
