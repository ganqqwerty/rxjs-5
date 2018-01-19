
import { Observable } from '../../internal/Observable';
import { mergeMap } from '../../internal/patching/operator/mergeMap';

Observable.prototype.mergeMap = <any>mergeMap;
Observable.prototype.flatMap = <any>mergeMap;

declare module '../../internal/Observable' {
  interface Observable<T> {
    // v4-backwards-compatibility
    flatMap: <R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<R>, concurrent?: number) => Observable<R>;
    mergeMap: typeof mergeMap;
  }
}
