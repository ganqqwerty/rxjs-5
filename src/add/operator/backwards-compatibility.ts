// v4-backwards-compatibility

import { Observable } from '../../internal/Observable';

import { race } from '../../internal/patching/operator/race';
Observable.prototype.amb = race;
declare module '../../internal/Observable' {
  interface Observable<T> {
    amb: typeof race;
  }
}

import { bufferCount } from '../../internal/patching/operator/bufferCount';
Observable.prototype.bufferWithCount = bufferCount;
declare module '../../internal/Observable' {
  interface Observable<T> {
    bufferWithCount: typeof bufferCount;
  }
}

import { bufferTime } from '../../internal/patching/operator/bufferTime';
Observable.prototype.bufferWithTime = bufferTime;
declare module '../../internal/Observable' {
  interface Observable<T> {
    bufferWithTime: typeof bufferTime;
  }
}

import { _do } from '../../internal/patching/operator/do';
Observable.prototype.doOnNext = _do;
Observable.prototype.doOnError = function doOnError<T>(this: Observable<T>, cb: (err: any) => void) {
  return this.do(undefined, cb);
};
Observable.prototype.doOnCompleted = function doOnCompleted<T>(this: Observable<T>, cb: () => void) {
  return this.do(undefined, undefined, cb);
};
declare module '../../internal/Observable' {
  interface Observable<T> {
    doOnNext: typeof _do;
    doOnError: (this: Observable<T>, error: (err: any) => void) => Observable<T>;
    doOnCompleted: (this: Observable<T>, complete: () => void) => Observable<T>;
  }
}

import { exhaustMap } from '../../internal/patching/operator/exhaustMap';
Observable.prototype.flatMapFirst = exhaustMap;
declare module '../../internal/Observable' {
  interface Observable<T> {
    flatMapFirst: typeof exhaustMap;
  }
}

import { switchMap } from '../../internal/patching/operator/switchMap';
Observable.prototype.flatMapLatest = switchMap;
declare module '../../internal/Observable' {
  interface Observable<T> {
    flatMapLatest: <R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<R>) => Observable<R>;
  }
}

Observable.prototype.flatMapWithMaxConcurrent = function<T, R>(this: Observable<T>, count: number, map: (next: T) => Observable<R>) {
  return this.mergeMap(map, count);
};
declare module '../../internal/Observable' {
  interface Observable<T> {
    flatMapWithMaxConcurrent: <R>(this: Observable<T>, count: number, map: (next: T) => Observable<R>) => Observable<R>;
  }
}

import { pausableBuffered } from '../../internal/patching/operator/pausableBuffered';
Observable.prototype.pausableBuffered_deprecated = pausableBuffered;
declare module '../../internal/Observable' {
  interface Observable<T> {
    pausableBuffered_deprecated: typeof pausableBuffered;
  }
}

import { exhaust } from '../../internal/patching/operator/exhaust';
Observable.prototype.switchFirst = exhaust;
declare module '../../internal/Observable' {
  interface Observable<T> {
    switchFirst: typeof exhaust;
  }
}

import { _switch } from '../../internal/patching/operator/switch';
Observable.prototype.switchLatest = _switch;
declare module '../../internal/Observable' {
  interface Observable<T> {
    switchLatest: typeof _switch;
  }
}

import { windowCount } from '../../internal/patching/operator/windowCount';
Observable.prototype.windowWithCount = windowCount;
declare module '../../internal/Observable' {
  interface Observable<T> {
    windowWithCount: typeof windowCount;
  }
}

import { windowTime } from '../../internal/patching/operator/windowTime';
Observable.prototype.windowWithTime = windowTime;
declare module '../../internal/Observable' {
  interface Observable<T> {
    windowWithTime: typeof windowTime;
  }
}
