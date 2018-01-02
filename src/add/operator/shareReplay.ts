
import { Observable } from '../../Observable';
import { shareReplay } from '../../operator/shareReplay';

// v4-backwards-compatibility
Observable.prototype.shareReplay_persisted = shareReplay;
Observable.prototype.shareReplay = function<T>(this: Observable<T>, count: number): Observable<T> {
  return this.publishReplay(count).refCount();
};

declare module '../../Observable' {
  interface Observable<T> {
    // v4-backwards-compatibility
    shareReplay: typeof shareReplay;
    shareReplay_persisted: typeof shareReplay;
  }
}