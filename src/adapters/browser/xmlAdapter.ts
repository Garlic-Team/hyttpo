import { Response } from '../../structures/Response';
import { HPromise } from '../../structures/HPromise';
import { PayloadMethod, PayloadRequest } from '../../util/constants';
import Utils from '../../util/utils';

export const xmlAdapter = (data: PayloadRequest): HPromise<Response> => {
	let resolves;
	let rejects;

	const promise: HPromise<unknown> = new HPromise((resolve, reject) => {
		resolves = resolve;
		rejects = reject;
	});

	const headers: { [key: string]: unknown } = data.headers ? Utils.stringsToLowerCase(data.headers as { [key: string]: unknown; }) : {};
	const body = data.body || null;

	if (Utils.isFormData(body)) delete headers['Content-Type'];

	const url = new URL(data.url);

	const request: XMLHttpRequest = new XMLHttpRequest();
	const method: PayloadMethod = data.method.toUpperCase() as PayloadMethod;

	request.open(method, url);

	const onLoadEnd = () => {
		if (!request) return;

		if (!headers.accept) headers.accept = 'application/json, text/plain, */*';
		if (!headers['user-agent']) headers['user-agent'] = 'hyttpo/XMLHttp (+https://github.com/Garlic-Team/hyttpo)';

		const responseHeaders = 'getAllResponseHeaders' in request ? Utils.parseHeaders(request.getAllResponseHeaders()) : null;
		let responseData = !data.responseType || data.responseType === 'text' || data.responseType === 'json' ? request.responseText : request.response;

		if (!['arraybuffer', 'buffer'].includes(data.responseType)) responseData = Utils.responseRefactor(responseData, data.responseEncoding);

		const response = new Response({
			request: request,
			statusCode: request.status,
			statusMessage: request.statusText,
			headers: responseHeaders,
			responseUrl: request.responseURL,
			data: responseData,
		});

		data.onEnd?.({ response });
		promise.emit('end', { response });

		if (response.ok) resolves(response);
		else rejects(response);
	};

	if ('onloadend' in request) { request.onloadend = onLoadEnd; } else {
		request.onreadystatechange = () => {
			if (!request || request.readyState !== 4 || request.status === 0 || !(request.responseURL && request.responseURL.indexOf('file:') === 0)) return;

			setTimeout(onLoadEnd);
		};
	}

	request.onloadstart = event => {
		promise.emit('response', event);
		data.onResponse?.(event);
	};

	request.onprogress = event => {
		promise.emit('downloadProgress', event);
		data.onDownloadProgress?.(event);
	};

	request.upload.onprogress = event => {
		promise.emit('uploadProgress', event);
		data.onUploadProgress?.(event);
	};

	request.onabort = () => {
		if (!request) return;
		promise.emit('error', 'Request aborted');
		data.onError?.('Request aborted');
		rejects('Request aborted');
	};

	request.onerror = () => {
		if (!request) return;
		promise.emit('error', 'Network Error');
		data.onError?.('Network Error');
		rejects('Network Error');
	};

	request.ontimeout = () => {
		if (!request) return;
		promise.emit('error', 'Request timeout');
		data.onError?.('Request timeouted');
		rejects('Request timeouted');
	};

	if ('setRequestHeader' in request) {
		for (const [key, value] of Object.entries(headers)) {
			if (typeof data === 'undefined' && key.toLowerCase() === 'content-type') delete headers[key];
			else request.setRequestHeader(key, value as string);
		}
	}

	// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (data.responseType && data.responseType.toLowerCase() !== 'json') request.responseType = data.responseType.toLowerCase();

	request.send(body);

	return promise as HPromise<Response>;
};
