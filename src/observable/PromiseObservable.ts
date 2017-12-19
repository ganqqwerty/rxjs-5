import { root } from '../util/root';
import { IScheduler } from '../Scheduler';
import { Observable } from '../Observable';
import { Subscriber } from '../Subscriber';
import { TeardownLogic } from '../Subscription';

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
export class PromiseObservable<T> extends Observable<T> {

  public value: T;

  // youView-specific memory leak fix
  private __isError = false;
  private __error: any;

  /**
   * Converts a Promise to an Observable.
   *
   * <span class="informal">Returns an Observable that just emits the Promise's
   * resolved value, then completes.</span>
   *
   * Converts an ES2015 Promise or a Promises/A+ spec compliant Promise to an
   * Observable. If the Promise resolves with a value, the output Observable
   * emits that resolved value as a `next`, and then completes. If the Promise
   * is rejected, then the output Observable emits the corresponding Error.
   *
   * @example <caption>Convert the Promise returned by Fetch to an Observable</caption>
   * var result = Rx.Observable.fromPromise(fetch('http://myserver.com/'));
   * result.subscribe(x => console.log(x), e => console.error(e));
   *
   * @see {@link bindCallback}
   * @see {@link from}
   *
   * @param {PromiseLike<T>} promise The promise to be converted.
   * @param {Scheduler} [scheduler] An optional IScheduler to use for scheduling
   * the delivery of the resolved value (or the rejection).
   * @return {Observable<T>} An Observable which wraps the Promise.
   * @static true
   * @name fromPromise
   * @owner Observable
   */
  static create<T>(promise: PromiseLike<T>, scheduler?: IScheduler): Observable<T> {
    return new PromiseObservable(promise, scheduler);
  }

  constructor(private promise: PromiseLike<T>, private scheduler?: IScheduler) {
    super();
  }

  protected _subscribe(subscriber: Subscriber<T>): TeardownLogic {
    let promise = this.promise;
    const scheduler = this.scheduler;

    if (scheduler == null) {
      if (this._isScalar) {
        if (!subscriber.closed) {
          subscriber.next(this.value);
          subscriber.complete();
        }
      } else if (this.__isError) {
        // youView-specific memory leak fix
        if (!subscriber.closed) {
          subscriber.error(this.__error);
        }
      } else {
        promise.then(
          (value) => {
            // youView-specific memory leak fix
            this.promise = null;
            this.value = value;
            this._isScalar = true;
            if (!subscriber.closed) {
              subscriber.next(value);
              subscriber.complete();
            }
          },
          (err) => {
            // youView-specific memory leak fix
            this.promise = null;
            this.__isError = true;
            this.__error = err;
            if (!subscriber.closed) {
              subscriber.error(err);
            }
          }
        )
        .then(null, err => {
          // escape the promise trap, throw unhandled errors
          root.setTimeout(() => { throw err; });
        });
        // youView-specific memory leak fix
        promise = null;
      }
    } else {
      if (this._isScalar) {
        if (!subscriber.closed) {
          return scheduler.schedule(dispatchNext, 0, { value: this.value, subscriber });
        }
       } else if (this.__isError) {
        // youView-specific memory leak fix
        if (!subscriber.closed) {
          return scheduler.schedule(dispatchError, 0, { err: this.__error, subscriber });
        }
      } else {
        promise.then(
          (value) => {
            // youView-specific memory leak fix
            this.promise = null;
            this.value = value;
            this._isScalar = true;
            if (!subscriber.closed) {
              subscriber.add(scheduler.schedule(dispatchNext, 0, { value, subscriber }));
            }
          },
          (err) => {
            // youView-specific memory leak fix
            this.promise = null;
            this.__isError = true;
            this.__error = err;
            if (!subscriber.closed) {
              subscriber.add(scheduler.schedule(dispatchError, 0, { err, subscriber }));
            }
          })
          .then(null, (err) => {
            // escape the promise trap, throw unhandled errors
            root.setTimeout(() => { throw err; });
          });
        // youView-specific memory leak fix
        promise = null;
      }
    }
  }
}

interface DispatchNextArg<T> {
  subscriber: Subscriber<T>;
  value: T;
}
function dispatchNext<T>(arg: DispatchNextArg<T>) {
  const { value, subscriber } = arg;
  if (!subscriber.closed) {
    subscriber.next(value);
    subscriber.complete();
  }
}

interface DispatchErrorArg<T> {
  subscriber: Subscriber<T>;
  err: any;
}
function dispatchError<T>(arg: DispatchErrorArg<T>) {
  const { err, subscriber } = arg;
  if (!subscriber.closed) {
    subscriber.error(err);
  }
}
