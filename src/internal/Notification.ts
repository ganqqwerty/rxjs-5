import { PartialObserver } from './Observer';
import { Observable } from './Observable';
import { empty } from './observable/empty';
import { of } from './observable/of';
import { _throw } from './observable/throw';

/**
 * Represents a push-based event or value that an {@link Observable} can emit.
 * This class is particularly useful for operators that manage notifications,
 * like {@link materialize}, {@link dematerialize}, {@link observeOn}, and
 * others. Besides wrapping the actual delivered value, it also annotates it
 * with metadata of, for instance, what type of push message it is (`next`,
 * `error`, or `complete`).
 *
 * @see {@link materialize}
 * @see {@link dematerialize}
 * @see {@link observeOn}
 *
 * @class Notification<T>
 */
export class Notification<T> {
  hasValue: boolean;

  constructor(public kind: string, public value?: T, public error?: any) {
    this.hasValue = kind === 'N';
  }

  /**
   * Delivers to the given `observer` the value wrapped by this Notification.
   * @param {Observer} observer
   * @return
   */
  observe(observer: PartialObserver<T>): any {
    switch (this.kind) {
      case 'N':
        return observer.next && observer.next(this.value);
      case 'E':
        return observer.error && observer.error(this.error);
      case 'C':
        return observer.complete && observer.complete();
    }
  }

  /**
   * Given some {@link Observer} callbacks, deliver the value represented by the
   * current Notification to the correctly corresponding callback.
   * @param {function(value: T): void} next An Observer `next` callback.
   * @param {function(err: any): void} [error] An Observer `error` callback.
   * @param {function(): void} [complete] An Observer `complete` callback.
   * @return {any}
   */
  do(next: (value: T) => void, error?: (err: any) => void, complete?: () => void): any {
    const kind = this.kind;
    switch (kind) {
      case 'N':
        return next && next(this.value);
      case 'E':
        return error && error(this.error);
      case 'C':
        return complete && complete();
    }
  }

  /**
   * Takes an Observer or its individual callback functions, and calls `observe`
   * or `do` methods accordingly.
   * @param {Observer|function(value: T): void} nextOrObserver An Observer or
   * the `next` callback.
   * @param {function(err: any): void} [error] An Observer `error` callback.
   * @param {function(): void} [complete] An Observer `complete` callback.
   * @return {any}
   */
  accept(nextOrObserver: PartialObserver<T> | ((value: T) => void), error?: (err: any) => void, complete?: () => void) {
    if (nextOrObserver && typeof (<PartialObserver<T>>nextOrObserver).next === 'function') {
      return this.observe(<PartialObserver<T>>nextOrObserver);
    } else {
      return this.do(<(value: T) => void>nextOrObserver, error, complete);
    }
  }

  /**
   * Returns a simple Observable that just delivers the notification represented
   * by this Notification instance.
   * @return {any}
   */
  toObservable(): Observable<T> {
    const kind = this.kind;
    switch (kind) {
      case 'N':
        return of(this.value);
      case 'E':
        return _throw(this.error);
      case 'C':
        return empty<T>();
    }
    throw new Error('unexpected notification kind value');
  }

  private static completeNotification: Notification<any> = new Notification('C');
  private static undefinedValueNotification: Notification<any> = new Notification('N', undefined);

  /**
   * A shortcut to create a Notification instance of the type `next` from a
   * given value.
   * @param {T} value The `next` value.
   * @return {Notification<T>} The "next" Notification representing the
   * argument.
   */
  static createNext<T>(value: T): Notification<T> {
    if (typeof value !== 'undefined') {
      return new Notification('N', value);
    }
    return Notification.undefinedValueNotification;
  }

  /**
   * A shortcut to create a Notification instance of the type `error` from a
   * given error.
   * @param {any} [err] The `error` error.
   * @return {Notification<T>} The "error" Notification representing the
   * argument.
   */
  static createError<T>(err?: any): Notification<T> {
    return new Notification('E', undefined, err);
  }

  /**
   * A shortcut to create a Notification instance of the type `complete`.
   * @return {Notification<any>} The valueless "complete" Notification.
   */
  static createComplete(): Notification<any> {
    return Notification.completeNotification;
  }

  // v4-backwards-compatibility
  static createOnNext: typeof Notification['createNext'];
  static createOnError: typeof Notification['createError'];
  static createOnCompleted: typeof Notification['createComplete'];
}

// v4-backwards-compatibility
Notification.createOnNext = Notification.createNext;
Notification.createOnError = Notification.createError;
Notification.createOnCompleted = Notification.createComplete;
