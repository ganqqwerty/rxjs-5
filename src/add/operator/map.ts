
import { Observable } from '../../internal/Observable';
import { map } from '../../internal/patching/operator/map';

Observable.prototype.map = map;

declare module '../../internal/Observable' {
  interface Observable<T> {
    map<R>(this: Observable<T>, project: (value: T, index: number) => R, thisArg?: any): Observable<R>;
  }
}
