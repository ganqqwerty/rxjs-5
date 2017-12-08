// v4-backwards-compatibility
// throttle -> throttleTime
import { Observable } from '../../Observable';
import { throttle } from '../../operator/throttle';
import { throttleTime } from '../../operator/throttleTime';

Observable.prototype.throttle = throttleTime;
Observable.prototype.throttleV5 = throttle;

declare module '../../Observable' {
  interface Observable<T> {
    throttle: typeof throttleTime;
    throttleV5: typeof throttle;
  }
}