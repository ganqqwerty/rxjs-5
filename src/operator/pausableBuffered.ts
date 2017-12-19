// v4-backwards-compatibility
import { Observable } from '../Observable';
import { pausableBuffered as higherOrder } from '../operators/pausableBuffered';

export function pausableBuffered<T>(this: Observable<T>, pauser: Observable<boolean>): Observable<T> {
  return higherOrder<T>(pauser)(this);
}
