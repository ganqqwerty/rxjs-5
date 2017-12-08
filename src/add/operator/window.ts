
import { Observable } from '../../Observable';
import { window } from '../../operator/window';
import { windowWhen } from '../../operator/windowWhen';

Observable.prototype.window = windowWhen;
Observable.prototype.windowV5 = window;

declare module '../../Observable' {
  interface Observable<T> {
    // v4-backwards-compatibility
    window: typeof windowWhen;
    windowV5: typeof window;
  }
}