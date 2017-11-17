// v4-backwards-compatibility

import { Observable } from '../../Observable';

function papp(fn: Function, args1: any[]) {
  return function(this: any, ...args2: any[]) {
    return fn.apply(this, args1.concat(args2));
  };
}

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
Observable.prototype.doOnError = papp(_do, [undefined]);
Observable.prototype.doOnCompleted = papp(_do, [undefined, undefined]);
declare module '../../Observable' {
  interface Observable<T> {
    doOnNext: typeof _do;
    doOnError: (this: Observable<T>, error: (err: any) => void) => Observable<T>;
    doOnCompleted: (this: Observable<T>, complete: () => void) => Observable<T>;
  }
}

import { _finally } from '../../operator/finally';
Observable.prototype.ensure = _finally;
declare module '../../Observable' {
  interface Observable<T> {
    ensure: typeof _finally;
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
Observable.prototype.selectSwitch = switchMap;
Observable.prototype.flatMapLatest = switchMap;
declare module '../../Observable' {
  interface Observable<T> {
    flatMapLatest: typeof switchMap;
    selectSwitch: typeof switchMap;
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

Observable.prototype.includes = function<T, R>(this: Observable<T>, value: T, comparer?: (a: T, b: T) => boolean): Observable<boolean> {
  if (typeof comparer === 'function') {
    return this.first(x => comparer(value, x), () => true, false);
  } else {
    return this.first(x => x === value, () => true, false);
  }
};
declare module '../../Observable' {
  interface Observable<T> {
    includes: (this: Observable<T>, value: T, comparer?: (a: T, b: T) => boolean) => Observable<boolean>;
  }
}

Observable.prototype.indexOf = function<T>(this: Observable<T>, element: T, fromIndex?: number): Observable<number> {
  const skip = Math.max(typeof fromIndex === 'number' ? fromIndex - 1 : 0, 0);
  return this.map<T, [boolean, number]>((x, i) => [x === element, i]).skip(skip).filter(([x]) => x).map(v => v[1]).first();
};
declare module '../../Observable' {
  interface Observable<T> {
    indexOf: (this: Observable<T>, element: T, fromIndex?: number) => Observable<number>;
  }
}

Observable.prototype.lastIndexOf = function<T>(this: Observable<T>, element: T, fromIndex?: number): Observable<number> {
  const skip = Math.max(typeof fromIndex === 'number' ? fromIndex - 1 : 0, 0);
  return this.map<T, [boolean, number]>((x, i) => [x === element, i]).skip(skip).filter(([x]) => x).map(v => v[1]).last();
};
declare module '../../Observable' {
  interface Observable<T> {
    lastIndexOf: (this: Observable<T>, element: T, fromIndex?: number) => Observable<number>;
  }
}

Observable.prototype.slice = function<T>(this: Observable<T>, start: number, end: number) {
  return this.skip(start).take(end - start);
};
declare module '../../Observable' {
  interface Observable<T> {
    slice: (this: Observable<T>, start: number, end: number) => Observable<T>;
  }
}

Observable.prototype.some = function<T>(this: Observable<T>, predicate: (v: T) => boolean) {
  return this.first(predicate, () => true, false);
};
declare module '../../Observable' {
  interface Observable<T> {
    some: (this: Observable<T>, predicate: (v: T) => boolean) => Observable<boolean>;
  }
}

Observable.prototype.sum = function<T>(this: Observable<T>, keySelector?: (v: T) => number) {
  if (keySelector) {
    return this.map(keySelector).reduce((s, v) => s + v, 0);
  } else {
    return this.reduce((s, v) => s + (v as any as number), 0);
  }
};
declare module '../../Observable' {
  interface Observable<T> {
    sum: (this: Observable<T>, keySelector?: (v: T) => number) => Observable<number>;
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

Observable.prototype.takeLastBuffer = function<T>(this: Observable<T>, count: number) {
  return this.takeLast(count).toArray();
};
declare module '../../Observable' {
  interface Observable<T> {
    takeLastBuffer: (this: Observable<T>, count: number) => Observable<T[]>;
  }
}

Observable.prototype.tap = _do;
Observable.prototype.tapOnNext = _do;
Observable.prototype.tapOnError = papp(_do, [undefined]);
Observable.prototype.tapOnCompleted = papp(_do, [undefined, undefined]);
declare module '../../Observable' {
  interface Observable<T> {
    tap: typeof _do;
    tapOnNext: typeof _do;
    tapOnError: (this: Observable<T>, error: (err: any) => void) => Observable<T>;
    tapOnCompleted: (this: Observable<T>, complete: () => void) => Observable<T>;
  }
}

import { filter } from '../../operator/filter';
Observable.prototype.where = filter;
declare module '../../Observable' {
  interface Observable<T> {
    where: typeof filter;
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

// TODO
declare module '../../Observable' {
  interface Observable<T> {
    and: any;
    average: any;
    bufferWithTimeOrCount: any;
    concatMapObserver: any;
    controlled: any;
    delaySubscription: any;
    doWhile: any;
    extend: any;
    flatMapObserver: any;
    forkJoin: any;
    groupByUntil: any;
    groupJoin: any;
    join: any;
    joinSortUntil: any;
    joinSort: any;
    manySelect: any;
    maxBy: any;
    minBy: any;
    pausableBuffered: any;
    pausable: any;
    publishValue: any;
    replay: any;
    selectConcatObserver: any;
    selectConcat: any;
    selectMany: any;
    selectManyObserver: any;
    selectManyWithMaxConcurrent: any;
    selectMapWithMaxConcurrent: any;
    select: any; // map
    selectSwitchFirst: any;
    shareValue: any;
    singleInstance: any;
    skipLastWithTime: any;
    skipUntilWithTime: any;
    skipWithTime: any;
    takeLastBufferWithTime: any;
    takeLastWithTime: any;
    takeUntilWithTime: any;
    takeWithTime: any;
    thenDo: any;
    throttleLatest: any;
    toMap: any;
    toSet: any;
    transduce: any;
    windowWithTimeOrCount: any;
  }
}
