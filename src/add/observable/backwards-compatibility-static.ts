// v4-backwards-compatibility

import { Observable } from '../../Observable';

import { race } from '../../observable/race';
Observable.amb = race;
declare module '../../Observable' {
  namespace Observable {
    export let amb: typeof race;
  }
}

import { of as staticOf } from '../../observable/of';
Observable.just = staticOf;
(Observable as any).return = staticOf;
declare module '../../Observable' {
  namespace Observable {
    export let just: typeof staticOf; //formOf an iceberg!
  }
}

import {from} from '../../observable/from';
Observable.fromArray = from;
declare module '../../Observable' {
  namespace Observable {
    export let fromArray: typeof from;
  }
}
