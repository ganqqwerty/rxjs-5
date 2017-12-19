// v4-backwards-compatibility
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
  private draining = false;

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

  private __drain() {
    const { buffer } = this;
    while (buffer.length > 0) {
        this.destination.next(buffer.shift());
    }
  }

  private drainQueue() {
    if (this.draining) {
      return;
    }
    this.draining = true;
    try {
      this.__drain();
    } finally {
      this.draining = false;
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
    if (flowing) {
      this.drainQueue();
    }
  }

  protected _complete(): void {
    this.srcCompleted = true;
    if (this.pauserCompleted) {
      this.drainQueue();
      this.destination.complete();
    }
  }

  notifyComplete(innerSub: Subscription): void {
    this.pauserCompleted = true;
    this.remove(innerSub);
    if (this.srcCompleted) {
      this.drainQueue();
      this.destination.complete();
    }
  }

  protected _error(err: any): void {
    this.drainQueue();
    this.destination.error(err);
  }

  notifyError(err: any): void {
    this._error(err);
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
