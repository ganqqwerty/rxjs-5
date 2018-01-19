
import { Observable } from '../../internal/Observable';
import { throttle } from '../../internal/patching/operator/throttle';
import { throttleTime } from '../../internal/patching/operator/throttleTime';

// v4-backwards-compatibility
Observable.prototype.throttle = throttleTime;
Observable.prototype.throttleV5 = throttle;

declare module '../../internal/Observable' {
  interface Observable<T> {
    // v4-backwards-compatibility
    throttle: typeof throttleTime;
    // v4-backwards-compatibility
    throttleV5: typeof throttle;
  }
}
