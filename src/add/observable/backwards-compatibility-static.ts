// v4-backwards-compatibility

import { Observable } from '../../internal/Observable';

import { race } from '../../internal/observable/race';
Observable.amb = race;
declare module '../../internal/Observable' {
  namespace Observable {
    export let amb: typeof race;
  }
}

import { of as staticOf } from '../../internal/observable/of';
Observable.just = staticOf;
declare module '../../internal/Observable' {
  namespace Observable {
    export let just: typeof staticOf; //formOf an iceberg!
  }
}

import {from} from '../../internal/observable/from';
Observable.fromArray = from;
declare module '../../internal/Observable' {
  namespace Observable {
    export let fromArray: typeof from;
  }
}
