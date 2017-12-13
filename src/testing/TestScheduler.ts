import { Observable } from '../Observable';
import { Observer } from '../Observer';
import { Notification } from '../Notification';
import { ColdObservable } from './ColdObservable';
import { HotObservable } from './HotObservable';
import { TestMessage } from './TestMessage';
import { SubscriptionLog } from './SubscriptionLog';
import { Subscription } from '../Subscription';
import { VirtualTimeScheduler, VirtualAction } from '../scheduler/VirtualTimeScheduler';
import { MockPromise } from './MockPromise';

// v4-backwards-compatibility
import {ReactiveTest} from './ReactiveTest';

// v4-backwards-compatibility
// 750 => 5000
const defaultMaxFrame: number = 5000;

interface FlushableTest {
  ready: boolean;
  actual?: any[];
  expected?: any[];
}

export type observableToBeFn = (marbles: string, values?: any, errorValue?: any) => void;
export type subscriptionLogsToBeFn = (marbles: string | string[]) => void;

export class TestScheduler extends VirtualTimeScheduler {
  private hotObservables: HotObservable<any>[] = [];
  private coldObservables: ColdObservable<any>[] = [];
  private flushTests: FlushableTest[] = [];

  constructor(public assertDeepEqual: (actual: any, expected: any) => boolean | void) {
    super(VirtualAction, defaultMaxFrame);
  }

  createTime(marbles: string): number {
    const indexOf: number = marbles.indexOf('|');
    if (indexOf === -1) {
      throw new Error('marble diagram for time should have a completion marker "|"');
    }
    return indexOf * TestScheduler.frameTimeFactor;
  }

  // v4-backwards-compatibility
  createColdObservable<T>(...messages: TestMessage[]): ColdObservable<T>;

  createColdObservable<T>(marbles: string, values?: any, error?: any): ColdObservable<T>;
  createColdObservable<T>(...args: any[]): ColdObservable<T> {
    if (args.length === 0) {
      // v4-backwards-compatibility
      return this.createColdObservable('');
    }
    let messages: TestMessage[];
    if (typeof args[0] === 'string') {
      const [marbles, values, error] = args;
      if (marbles.indexOf('^') !== -1) {
        throw new Error('cold observable cannot have subscription offset "^"');
      }
      if (marbles.indexOf('!') !== -1) {
        throw new Error('cold observable cannot have unsubscription marker "!"');
      }
      messages = TestScheduler.parseMarbles(marbles, values, error);
    } else {
      // v4-backwards-compatibility
      messages = args;
    }
    const cold = new ColdObservable<T>(messages, this);
    this.coldObservables.push(cold);
    return cold;
  }

  // v4-backwards-compatibility
  createHotObservable<T>(...messages: TestMessage[]): HotObservable<any>;

  createHotObservable<T>(marbles: string, values?: any, error?: any): HotObservable<T>;
  createHotObservable<T>(...args: any[]): HotObservable<T> {
    if (args.length === 0) {
      // v4-backwards-compatibility
      return this.createHotObservable('');
    }
    let messages: TestMessage[];
    if (typeof args[0] === 'string') {
      const [marbles, values, error] = args;
      if (marbles.indexOf('!') !== -1) {
        throw new Error('hot observable cannot have unsubscription marker "!"');
      }
      messages = TestScheduler.parseMarbles(marbles, values, error);
    } else {
      // v4-backwards-compatibility
      messages = args;
    }
    const subject = new HotObservable<T>(messages, this);
    this.hotObservables.push(subject);
    return subject;
  }

  private materializeInnerObservable(observable: Observable<any>,
                                     outerFrame: number): TestMessage[] {
    const messages: TestMessage[] = [];
    observable.subscribe((value) => {
      messages.push({ frame: this.frame - outerFrame, notification: Notification.createNext(value), get value() { return this.notification; } });
    }, (err) => {
      messages.push({ frame: this.frame - outerFrame, notification: Notification.createError(err), get value() { return this.notification; } });
    }, () => {
      messages.push({ frame: this.frame - outerFrame, notification: Notification.createComplete(), get value() { return this.notification; } });
    });
    return messages;
  }

  expectObservable(observable: Observable<any>,
                   unsubscriptionMarbles: string = null): ({ toBe: observableToBeFn }) {
    const actual: TestMessage[] = [];
    const flushTest: FlushableTest = { actual, ready: false };
    const unsubscriptionFrame = TestScheduler
      .parseMarblesAsSubscriptions(unsubscriptionMarbles).unsubscribedFrame;
    let subscription: Subscription;

    this.schedule(() => {
      subscription = observable.subscribe(x => {
        let value = x;
        // Support Observable-of-Observables
        if (x instanceof Observable) {
          value = this.materializeInnerObservable(value, this.frame);
        }
        actual.push({ frame: this.frame, notification: Notification.createNext(value), get value() { return this.notification; } });
      }, (err) => {
        actual.push({ frame: this.frame, notification: Notification.createError(err), get value() { return this.notification; } });
      }, () => {
        actual.push({ frame: this.frame, notification: Notification.createComplete(), get value() { return this.notification; } });
      });
    }, 0);

    if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
      this.schedule(() => subscription.unsubscribe(), unsubscriptionFrame);
    }

    this.flushTests.push(flushTest);

    return {
      toBe(marbles: string, values?: any, errorValue?: any) {
        flushTest.ready = true;
        flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true);
      }
    };
  }

  expectSubscriptions(actualSubscriptionLogs: SubscriptionLog[]): ({ toBe: subscriptionLogsToBeFn }) {
    const flushTest: FlushableTest = { actual: actualSubscriptionLogs, ready: false };
    this.flushTests.push(flushTest);
    return {
      toBe(marbles: string | string[]) {
        const marblesArray: string[] = (typeof marbles === 'string') ? [marbles] : marbles;
        flushTest.ready = true;
        flushTest.expected = marblesArray.map(marbles =>
          TestScheduler.parseMarblesAsSubscriptions(marbles)
        );
      }
    };
  }

  flush(limit = Number.POSITIVE_INFINITY) {
    const hotObservables = this.hotObservables;
    while (hotObservables.length > 0) {
      hotObservables.shift().setup();
    }

    if (limit === Number.POSITIVE_INFINITY) {
      super.flush();
      const readyFlushTests = this.flushTests.filter(test => test.ready);
      while (readyFlushTests.length > 0) {
        const test = readyFlushTests.shift();
        this.assertDeepEqual(test.actual, test.expected);
      }
    } else {
      super.limitedFlush(limit);
    }
  }

  static parseMarblesAsSubscriptions(marbles: string): SubscriptionLog {
    if (typeof marbles !== 'string') {
      return new SubscriptionLog(Number.POSITIVE_INFINITY);
    }
    const len = marbles.length;
    let groupStart = -1;
    let subscriptionFrame = Number.POSITIVE_INFINITY;
    let unsubscriptionFrame = Number.POSITIVE_INFINITY;

    for (let i = 0; i < len; i++) {
      const frame = i * this.frameTimeFactor;
      const c = marbles[i];
      switch (c) {
        case '-':
        case ' ':
          break;
        case '(':
          groupStart = frame;
          break;
        case ')':
          groupStart = -1;
          break;
        case '^':
          if (subscriptionFrame !== Number.POSITIVE_INFINITY) {
            throw new Error('found a second subscription point \'^\' in a ' +
              'subscription marble diagram. There can only be one.');
          }
          subscriptionFrame = groupStart > -1 ? groupStart : frame;
          break;
        case '!':
          if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
            throw new Error('found a second subscription point \'^\' in a ' +
              'subscription marble diagram. There can only be one.');
          }
          unsubscriptionFrame = groupStart > -1 ? groupStart : frame;
          break;
        default:
          throw new Error('there can only be \'^\' and \'!\' markers in a ' +
            'subscription marble diagram. Found instead \'' + c + '\'.');
      }
    }

    if (unsubscriptionFrame < 0) {
      return new SubscriptionLog(subscriptionFrame);
    } else {
      return new SubscriptionLog(subscriptionFrame, unsubscriptionFrame);
    }
  }

  static parseMarbles(marbles: string,
                      values?: any,
                      errorValue?: any,
                      materializeInnerObservables: boolean = false): TestMessage[] {
    if (marbles.indexOf('!') !== -1) {
      throw new Error('conventional marble diagrams cannot have the ' +
        'unsubscription marker "!"');
    }
    const len = marbles.length;
    const testMessages: TestMessage[] = [];
    const subIndex = marbles.indexOf('^');
    const frameOffset = subIndex === -1 ? 0 : (subIndex * -this.frameTimeFactor);
    const getValue = typeof values !== 'object' ?
      (x: any) => x :
      (x: any) => {
        // Support Observable-of-Observables
        if (materializeInnerObservables && values[x] instanceof ColdObservable) {
          return values[x].messages;
        }
        return values[x];
      };
    let groupStart = -1;

    for (let i = 0; i < len; i++) {
      const frame = i * this.frameTimeFactor + frameOffset;
      let notification: Notification<any>;
      const c = marbles[i];
      switch (c) {
        case '-':
        case ' ':
          break;
        case '(':
          groupStart = frame;
          break;
        case ')':
          groupStart = -1;
          break;
        case '|':
          notification = Notification.createComplete();
          break;
        case '^':
          break;
        case '#':
          notification = Notification.createError(errorValue || 'error');
          break;
        default:
          notification = Notification.createNext(getValue(c));
          break;
      }

      if (notification) {
        testMessages.push({ frame: groupStart > -1 ? groupStart : frame, notification, get value() { return this.notification; } });
      }
    }
    return testMessages;
  }

  // v4-backwards-compatibility
  createObserver() {
    const scheduler = this;
    const messages = [] as TestMessage[];
    const obs = Observer.create<any>(
      (v: any) => {
        messages.push({ frame: scheduler.now(), notification: Notification.createNext(v), get value() { return this.notification; } });
      }, (err: any) => {
        messages.push({ frame: scheduler.now(), notification: Notification.createError(err), get value() { return this.notification; } });
      }, () => {
        messages.push({ frame: scheduler.now(), notification: Notification.createComplete(), get value() { return this.notification; } });
      }) as Observer<any> & { messages: TestMessage[] };
    obs.messages = messages;
    return obs;
  }

  // v4-backwards-compatibility
  startScheduler(
    factory: () => Observable<any>,
    settings: { created: number, subscribed: number, disposed: number } = {} as any
  ): { messages: TestMessage[] } {
    const created = settings.created == null ? ReactiveTest.created : settings.created;
    const subscribed = settings.subscribed == null ? ReactiveTest.subscribed : settings.subscribed;
    const disposed = settings.disposed == null ? ReactiveTest.disposed : settings.disposed;

    const testObserver = this.createObserver();
    let subscription: any;
    let source: any;

    this.scheduleAbsolute(null, created, function() {
      source = factory();
    });

    this.scheduleAbsolute(null, subscribed, function() {
      subscription = source.subscribe(testObserver);
    });

    this.scheduleAbsolute(null, disposed, function() {
      subscription.dispose();
    });

    this.start();

    return testObserver;
  }

   // v4-backwards-compatibility
  public scheduleAbsolute(state: any, dueTime: number, action: () => any) {
    const processedTime = dueTime < this.clock ? this.clock + 1 : dueTime;
    return super.scheduleAbsolute(state, processedTime, action);
  }

  // v4-backwards-compatibility
  public advanceBy(time: number): void {
    this.flush(this.now() + time);
  }

  // v4-backwards-compatibility
  public advanceTo(time: number): void {
    this.flush(time);
  }

  // v4-backwards-compatibility
  public createResolvedPromise(time: number, value: any): { then: Function } {
    return new MockPromise(this, time, value, false);
  }

  // v4-backwards-compatibility
  public createRejectedPromise(time: number, rejection: any): { then: Function } {
    return new MockPromise(this, time, rejection, true);
  }

  // v4-backwards-compatibility
  public scheduleRelative(state: any, time: number, action: () => void) {
    this.schedule(action, this.now() + time, state);
  }

  // v4-backwards-compatibility
  public stop() {
    /* noop */
  }

  // v4-backwards-compatibility
  start: this['flush'];
}

// v4-backwards-compatibility
TestScheduler.prototype.start = TestScheduler.prototype.flush;
