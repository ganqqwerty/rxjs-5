import { Action } from './scheduler/Action';
import { Subscription } from './Subscription';

export type Rxjs4Action<TState> = (scheduler: IScheduler, state: TState) => IRxJs4Disposable;

export interface IRxJs4Disposable {
  dispose(): void;
}

export interface IRxJs4Scheduler {
  /** Gets the current time according to the local machine's system clock. */
  now(): number;

  schedule<TState>(state: TState, action: (scheduler: IScheduler, state: TState) => IRxJs4Disposable): IRxJs4Disposable;
  scheduleFuture<TState>(state: TState, dueTime: number | Date, action: (scheduler: IScheduler, state: TState) => IRxJs4Disposable): IRxJs4Disposable;
  scheduleRecursive<TState>(state: TState, action: (state: TState, action: (state: TState) => void) => void): IRxJs4Disposable;
  scheduleRecursiveFuture<TState, TTime extends number | Date>(
    state: TState,
    dueTime: TTime,
    action: (state: TState, action: (state: TState, dueTime: TTime) => void) => void
  ): IRxJs4Disposable;
  schedulePeriodic<TState>(state: TState, period: number, action: (state: TState) => TState): IRxJs4Disposable;
  catch(handler: Function): IRxJs4Scheduler;
}

export interface IRxJs5Scheduler {
  now(): number;
  schedule<T>(work: (this: Action<T>, state?: T) => void, delay?: number, state?: T): Subscription;
}

export type IScheduler = IRxJs4Scheduler & IRxJs5Scheduler;

/**
 * An execution context and a data structure to order tasks and schedule their
 * execution. Provides a notion of (potentially virtual) time, through the
 * `now()` getter method.
 *
 * Each unit of work in a Scheduler is called an {@link Action}.
 *
 * ```ts
 * class Scheduler {
 *   now(): number;
 *   schedule(work, delay?, state?): Subscription;
 * }
 * ```
 *
 * @class Scheduler
 */
export class Scheduler implements IScheduler {

  public static now: () => number = Date.now ? Date.now : () => +new Date();

  constructor(private SchedulerAction: typeof Action,
              now: () => number = Scheduler.now) {
    this.now = now;
  }

  /**
   * A getter method that returns a number representing the current time
   * (at the time this function was called) according to the scheduler's own
   * internal clock.
   * @return {number} A number that represents the current time. May or may not
   * have a relation to wall-clock time. May or may not refer to a time unit
   * (e.g. milliseconds).
   */
  public now: () => number;

  // v4-backwards-compatibility
  public schedule<TState>(state: TState, action: Rxjs4Action<TState>): IRxJs4Disposable;

  /**
   * Schedules a function, `work`, for execution. May happen at some point in
   * the future, according to the `delay` parameter, if specified. May be passed
   * some context object, `state`, which will be passed to the `work` function.
   *
   * The given arguments will be processed an stored as an Action object in a
   * queue of actions.
   *
   * @param {function(state: ?T): ?Subscription} work A function representing a
   * task, or some unit of work to be executed by the Scheduler.
   * @param {number} [delay] Time to wait before executing the work, where the
   * time unit is implicit and defined by the Scheduler itself.
   * @param {T} [state] Some contextual data that the `work` function uses when
   * called by the Scheduler.
   * @return {Subscription} A subscription in order to be able to unsubscribe
   * the scheduled work.
   */
  public schedule<T>(work: (this: Action<T>, state?: T) => void, delay?: number, state?: T): Subscription;
  public schedule<T>(workOrState?: any, delayOrAction = 0 as number | Rxjs4Action<T>, state?: any): Subscription {
    if (typeof delayOrAction === 'number') {
      return new this.SchedulerAction<T>(this, workOrState).schedule(state, delayOrAction);
    } else {
      // v4-backwards-compatibility
      return new this.SchedulerAction<T>(this, delayOrAction as any).schedule(workOrState);
    }
  }

  // v4-backwards-compatibility
  scheduleFuture: any;
  scheduleRecursive: any;
  scheduleRecursiveFuture: any;
  schedulePeriodic: any;
  catch: any;
}
