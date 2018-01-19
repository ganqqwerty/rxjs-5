
import { Observable } from '../../internal/Observable';
import { debounce } from '../../internal/patching/operator/debounce';
import { debounceTime } from '../../internal/patching/operator/debounceTime';

// v4-backwards-compatibility
Observable.prototype.debounce = debounceTime;
Observable.prototype.debounceV5 = debounce;

declare module '../../internal/Observable' {
  interface Observable<T> {
    // v4-backwards-compatibility
    debounce: typeof debounceTime;
    // v4-backwards-compatibility
    debounceV5: typeof debounce;
  }
}
