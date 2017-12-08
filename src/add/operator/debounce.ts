
import { Observable } from '../../Observable';
import { debounce } from '../../operator/debounce';
import { debounceTime } from '../../operator/debounceTime';

Observable.prototype.debounce = debounceTime;
Observable.prototype.debounceV5 = debounce;

declare module '../../Observable' {
  interface Observable<T> {
    // v4-backwards-compatibility
    debounce: typeof debounceTime;
    // v4-backwards-compatibility
    debounceV5: typeof debounce;
  }
}