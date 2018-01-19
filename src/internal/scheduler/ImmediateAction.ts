// v4-backwards-compatibility

import { Action } from './Action';
import { Subscription } from '../Subscription';
import { ImmediateScheduler } from './ImmediateScheduler';

export class ImmediateAction<T> extends Action<T> {
  constructor(scheduler: ImmediateScheduler, private work: (this: Action<T>, state?: T) => void) {
    super(scheduler, work);
  }

  public schedule(state?: T, delay: number = 0): Subscription {
    if (delay !== 0) {
      throw new Error('Only delays of 0 can be scheduled on the Rx.immediate scheduler');
    }
    this.work(state);
    return this;
  }
}
