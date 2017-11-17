/// <reference path="../node_modules/rx/ts/rx.all.d.ts" />

/**
 * Run with:
 * `./node_modules/.bin/tsc --noEmit ./tools/backwards-compatible.ts`
 */

import { Observable } from '../dist/package/Rx';
// import { Observable } from '../src/Rx';

export = {};

declare const rx5obs: Observable<string>;
declare const rx4obs: Rx.Observable<string>;

// v4-backwards-compatibility
const check: Rx.Observable<string> = rx5obs;
console.log(check);
