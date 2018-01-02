// v4-backwards-compatibility

import { Observable } from '../../Observable';

import { race } from '../../operator/race';
Observable.prototype.amb = race;
declare module '../../Observable' {
  interface Observable<T> {
    amb: typeof race;
  }
}

import { bufferCount } from '../../operator/bufferCount';
Observable.prototype.bufferWithCount = bufferCount;
declare module '../../Observable' {
  interface Observable<T> {
    bufferWithCount: typeof bufferCount;
  }
}

import { bufferTime } from '../../operator/bufferTime';
Observable.prototype.bufferWithTime = bufferTime;
declare module '../../Observable' {
  interface Observable<T> {
    bufferWithTime: typeof bufferTime;
  }
}

import { _do } from '../../operator/do';
Observable.prototype.doOnNext = _do;
Observable.prototype.doOnError = function doOnError<T>(this: Observable<T>, cb: (err: any) => void) {
  return this.do(undefined, cb);
};
Observable.prototype.doOnCompleted = function doOnCompleted<T>(this: Observable<T>, cb: () => void) {
  return this.do(undefined, undefined, cb);
};
declare module '../../Observable' {
  interface Observable<T> {
    doOnNext: typeof _do;
    doOnError: (this: Observable<T>, error: (err: any) => void) => Observable<T>;
    doOnCompleted: (this: Observable<T>, complete: () => void) => Observable<T>;
  }
}

import { exhaustMap } from '../../operator/exhaustMap';
Observable.prototype.flatMapFirst = exhaustMap;
declare module '../../Observable' {
  interface Observable<T> {
    flatMapFirst: typeof exhaustMap;
  }
}

import { switchMap } from '../../operator/switchMap';
Observable.prototype.flatMapLatest = switchMap;
declare module '../../Observable' {
  interface Observable<T> {
    flatMapLatest: <R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<R>) => Observable<R>;
  }
}

Observable.prototype.flatMapWithMaxConcurrent = function<T, R>(this: Observable<T>, count: number, map: (next: T) => Observable<R>) {
  return this.mergeMap(map, count);
};
declare module '../../Observable' {
  interface Observable<T> {
    flatMapWithMaxConcurrent: <R>(this: Observable<T>, count: number, map: (next: T) => Observable<R>) => Observable<R>;
  }
}

import { pausableBuffered } from '../../operator/pausableBuffered';
Observable.prototype.pausableBuffered_deprecated = pausableBuffered;
declare module '../../Observable' {
  interface Observable<T> {
    pausableBuffered_deprecated: typeof pausableBuffered;
  }
}

import { exhaust } from '../../operator/exhaust';
Observable.prototype.switchFirst = exhaust;
declare module '../../Observable' {
  interface Observable<T> {
    switchFirst: typeof exhaust;
  }
}

import { _switch } from '../../operator/switch';
Observable.prototype.switchLatest = _switch;
declare module '../../Observable' {
  interface Observable<T> {
    switchLatest: typeof _switch;
  }
}

import { windowCount } from '../../operator/windowCount';
Observable.prototype.windowWithCount = windowCount;
declare module '../../Observable' {
  interface Observable<T> {
    windowWithCount: typeof windowCount;
  }
}

import { windowTime } from '../../operator/windowTime';
Observable.prototype.windowWithTime = windowTime;
declare module '../../Observable' {
  interface Observable<T> {
    windowWithTime: typeof windowTime;
  }
}
