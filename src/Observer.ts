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
