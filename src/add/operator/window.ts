
import { Observable } from '../../internal/Observable';
import { window } from '../../internal/patching/operator/window';
import { windowWhen } from '../../internal/patching/operator/windowWhen';

// v4-backwards-compatibility
Observable.prototype.window = windowWhen;
Observable.prototype.windowV5 = window;

declare module '../../internal/Observable' {
  interface Observable<T> {
    // v4-backwards-compatibility
    window: typeof windowWhen;
    windowV5: typeof window;
  }
}
