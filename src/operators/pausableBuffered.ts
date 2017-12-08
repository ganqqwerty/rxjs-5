import { Observable } from '../Observable';
import { Operator } from '../Operator';
import { Subscriber } from '../Subscriber';
import { Subscription } from '../Subscription';
import { subscribeToResult } from '../util/subscribeToResult';
import { OuterSubscriber } from '../OuterSubscriber';
import { InnerSubscriber } from '../InnerSubscriber';
import { OperatorFunction } from '../interfaces';

class PausableBufferedSubscriber<T> extends OuterSubscriber<T, boolean> {
  private srcCompleted = false;
  private pauserCompleted = false;
  private flowing = false;
  private buffer: T[] = [];

  constructor(protected destination: Subscriber<T>, private pauser: Observable<boolean>) {
    super(destination);
    this.add(subscribeToResult(this, pauser));
  }

  protected _next(value: T): void {
    if (this.flowing) {
      this.destination.next(value);
    } else {
      const { buffer } = this;
      buffer[buffer.length] = value;
    }
  }

  notifyNext(outerValue: T, flowing: boolean,
             outerIndex: number, innerIndex: number,
             innerSub: InnerSubscriber<T, boolean>
  ): void {
    if (flowing === this.flowing) {
      return;
    }
    this.flowing = flowing;
    const { buffer } = this;
    const len = buffer.length;
    if (flowing && len > 0) {
      const b2 = buffer.slice();
      b2.length = 0;
      for (let i = 0; i < len; i++) {
        const v = b2[i];
        this.destination.next(v);
      }
    }
  }

  protected _complete(): void {
    this.srcCompleted = true;
    if (this.buffer.length === 0 || this.pauserCompleted) {
      this.destination.complete();
    }
  }

  notifyComplete(innerSub: Subscription): void {
    this.pauserCompleted = true;
    this.remove(innerSub);
    if (this.srcCompleted) {
      this.buffer.length = 0;
      this.destination.complete();
    }
  }
}

class PausableBufferedOperator<T> implements Operator<T, T> {
  constructor(private pauser: Observable<boolean>) { }

  call(subscriber: Subscriber<T>, source: Observable<T>): any {
    return source.subscribe(new PausableBufferedSubscriber(subscriber, this.pauser));
  }
}

export function pausableBuffered<T>(
  pauser: Observable<boolean>
): OperatorFunction<T, T> {
  return function pausableBufferedOperatorFunction(source: Observable<T>) {
    return source.lift(new PausableBufferedOperator(pauser));
  };
}
