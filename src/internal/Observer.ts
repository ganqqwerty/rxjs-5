
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

enum CheckedObserverState {
  IDLE, BUSY, DONE
}

// v4-backwards-compatibility
class ObserverImpl<T> implements Observer<T> {

  closed?: boolean;

  constructor(
    private n: Observer<T>['next'],
    private e: Observer<T>['error'],
    private c: Observer<T>['complete']
  ) {
  }

  next(value: T): void {
    if (!this.closed) {
      this.n(value);
    }
  }

  error(err: any): void {
    if (!this.closed) {
      this.closed = true;
      this.e(err);
    }
  }

  complete(): void {
    if (!this.closed) {
      this.closed = true;
      this.c();
    }
  }

  // v4-backwards-compatibility
  asObserver(): Observer<T> {
    const o = new ObserverImpl<T>(
      function(this: any, v) { this.__srcObserver.next(v); },
      function(this: any, e) { this.__srcObserver.error(e); },
      function(this: any, ) { this.__srcObserver.complete(); }
    );
    (o as any).__srcObserver = this;
    return o;
  }

  // v4-backwards-compatibility
  onNext?: this['next'];
  onError?: this['error'];
  onCompleted?: this['complete'];
}

// v4-backwards-compatibility
ObserverImpl.prototype.onNext = ObserverImpl.prototype.next;
ObserverImpl.prototype.onError = ObserverImpl.prototype.error;
ObserverImpl.prototype.onCompleted = ObserverImpl.prototype.complete;

// v4-backwards-compatibility
// `interface` => `class`
export class Observer<T> {
  closed?: boolean;

  // v4-backwards-compatibility
  // make class constructor private to retain rxjs5 interface-ish
  private constructor() {
    return Observer.create<any>();
  }

  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;

  // v4-backwards-compatibility
  static create<T>(
    maybeNext?: Observer<T>['next'],
    maybeError?: Observer<T>['error'],
    maybeComplete?: Observer<T>['complete']
  ): Observer<T> {
    const next: any = maybeNext === void 0 || maybeNext === null
      ? Function.prototype : maybeNext;
    const error: any = maybeError === void 0 || maybeError === null
      ? defaultError : maybeError;
    const complete: any = maybeComplete === void 0 || maybeComplete === null
      ? Function.prototype : maybeComplete;
    return new ObserverImpl<T>(next, error, complete);
  }

  // v4-backwards-compatibility
  onNext?: this['next'];
  onError?: this['error'];
  onCompleted?: this['complete'];
}

export const empty: Observer<any> = {
  closed: true,
  next(value: any): void { /* noop */},
  error(err: any): void { throw err; },
  complete(): void { /*noop*/ },
  onNext(value: any): void { /* noop */},
  onError(err: any): void { throw err; },
  onCompleted(): void { /*noop*/ }
};
