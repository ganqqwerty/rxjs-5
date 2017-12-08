
import { Observable } from '../../Observable';
import { map } from '../../operator/map';

Observable.prototype.map = map;

declare module '../../Observable' {
  interface Observable<T> {
    map<R>(this: Observable<T>, project: (value: T, index: number) => R, thisArg?: any): Observable<R>;
  }
}