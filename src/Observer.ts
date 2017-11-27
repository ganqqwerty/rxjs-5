import {Notification} from './Notification';

export interface NextObserver<T> {
  closed?: boolean;
  next: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;

   // v4-backwards-compatibility
   onNext?: this['next'];
   onError?: this['error'];
   onCompleted?: this['complete'];
}

export interface ErrorObserver<T> {
  closed?: boolean;
  next?: (value: T) => void;
  error: (err: any) => void;
  complete?: () => void;

  // v4-backwards-compatibility
  onNext?: this['next'];
  onError?: this['error'];
  onCompleted?: this['complete'];
}

export interface CompletionObserver<T> {
  closed?: boolean;
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete: () => void;

  // v4-backwards-compatibility
  onNext?: this['next'];
  onError?: this['error'];
  onCompleted?: this['complete'];
}

// v4-backwards-compatibility
export interface RxJs4NextObserver<T> {
  closed?: boolean;
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;

  onNext: (value: T) => void;
  onError?: (err: any) => void;
  onCompleted?: () => void;
}

// v4-backwards-compatibility
export interface RxJs4ErrorObserver<T> {
  closed?: boolean;
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;

  onNext?: (value: T) => void;
  onError: (err: any) => void;
  onCompleted?: () => void;
}

// v4-backwards-compatibility
export interface RxJs4CompleteObserver<T> {
  closed?: boolean;
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;

  onNext?: (value: T) => void;
  onError?: (err: any) => void;
  onCompleted: () => void;
}

// v4-backwards-compatibility
export type PartialRxJs4Observer<T> = RxJs4NextObserver<T> | RxJs4ErrorObserver<T> | RxJs4CompleteObserver<T>;

export type PartialObserver<T> = NextObserver<T> | ErrorObserver<T> | CompletionObserver<T> | PartialRxJs4Observer<T>;

// v4-backwards-compatibility
const defaultError = ((err: any) => { throw err; });

// v4-backwards-compatibility
// `interface` => `class`
export class Observer<T> {
  closed?: boolean;
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;

  // v4-backwards-compatibility
  onNext?: this['next'];
  onError?: this['error'];
  onCompleted?: this['complete'];

  // v4-backwards-compatibility
  static create<T>(
    maybeNext?: Observer<T>['next'],
    maybeError?: Observer<T>['error'],
    maybeComplete?: Observer<T>['complete']
  ): Observer<T> {
    const next: any = maybeNext || Function.prototype;
    const error: any = maybeError || defaultError;
    const complete: any = maybeComplete || Function.prototype;
    return {
      next, error, complete,
      onNext: next,
      onError: error,
      onCompleted: complete
    };
  }

  // v4-backwards-compatibility
  static fromNotifier(handler: (notification: any) => any, thisArg?: any): Observer<any> {
    const cb = thisArg === void 0 ? handler : handler.bind(thisArg);
    return Observer.create((n: any) => {
      return cb(Notification.createNext(n));
    }, (err: any) => {
      return cb(Notification.createError(err));
    }, () => {
      return cb(Notification.createComplete());
    });
  }
}

export const empty: Observer<any> = {
  closed: true,
  next(value: any): void { /* noop */},
  error(err: any): void { throw err; },
  complete(): void { /*noop*/ },

  // v4-backwards-compatibility
  onNext: void 0 as any,
  onError: void 0 as any,
  onCompleted: void 0 as any
};

// v4-backwards-compatibility
empty.onNext = empty.next;
empty.onError = empty.error;
empty.onCompleted = empty.onCompleted;
