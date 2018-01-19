
import { Observable } from '../../internal/Observable';
import { filter } from '../../internal/patching/operator/filter';

Observable.prototype.filter = filter;

declare module '../../internal/Observable' {
  interface Observable<T> {
    // v4-backwards-compatibility
    filter<S extends T>(
      this: Observable<T>,
      predicate: (value: T, index: number) => value is S,
      thisArg?: any
    ): Observable<S>;
    filter(
      this: Observable<T>,
      predicate: (value: T, index: number) => boolean,
      thisArg?: any
    ): Observable<T>;
  }
}
