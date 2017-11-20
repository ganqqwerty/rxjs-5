// v4-backwards-compatibility

import { Observable } from '../../Observable';
import { of as staticOf } from '../../observable/of';

Observable.just = staticOf;

declare module '../../Observable' {
  namespace Observable {
    export let just: typeof staticOf; //formOf an iceberg!
  }
}