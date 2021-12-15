import { Hyttpo } from './base/hyttpo';
export * from './base/hyttpo';
export * from './util/utils';
export * from './structures/Response';
export * from './structures/HPromise';
export * from './util/constants';

// Adapters
export * from './adapters/browser/xmlAdapter';
export * from './adapters/node/httpAdapter';

// Hyttpo
export const hyttpo = new Hyttpo();
export default hyttpo;
