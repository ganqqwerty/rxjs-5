import { expect } from 'chai';
import * as Rx from '../../src/Rx';
import { queue } from '../../src/internal/scheduler/queue';
import { IteratorObservable } from '../../src/internal/observable/IteratorObservable';

declare const expectObservable;
declare const rxTestScheduler: Rx.TestScheduler;

describe('IteratorObservable', () => {
  it('should create an Observable via constructor', () => {
    const source = new IteratorObservable([]);
    expect(source instanceof IteratorObservable).to.be.true;
  });

  it('should create IteratorObservable via static create function', () => {
    const s = new IteratorObservable([]);
    const r = IteratorObservable.create([]);
    expect(s).to.deep.equal(r);
  });

  it('should not accept null (or truthy-equivalent to null) iterator', () => {
    expect(() => {
      IteratorObservable.create(null);
    }).to.throw(Error, 'iterator cannot be null.');
    expect(() => {
      IteratorObservable.create(void 0);
    }).to.throw(Error, 'iterator cannot be null.');
  });

  it('should not accept boolean as iterator', () => {
    expect(() => {
      IteratorObservable.create(false);
    }).to.throw(Error, 'object is not iterable');
  });

  it('should emit members of an array iterator', (done: MochaDone) => {
    const expected = [10, 20, 30, 40];
    IteratorObservable.create([10, 20, 30, 40])
      .subscribe(
        (x: number) => { expect(x).to.equal(expected.shift()); },
        (x) => {
          done(new Error('should not be called'));
        }, () => {
          expect(expected.length).to.equal(0);
          done();
        }
      );
  });

  it('should get new iterator for each subscription', () => {
    const expected = [
      Rx.Notification.createNext(10),
      Rx.Notification.createNext(20),
      Rx.Notification.createComplete()
    ];

    const e1 = IteratorObservable.create<number>(new Int32Array([10, 20])).observeOn(rxTestScheduler);

    let v1, v2: Array<Rx.Notification<any>>;
    e1.materialize().toArray().subscribe((x) => v1 = x);
    e1.materialize().toArray().subscribe((x) => v2 = x);

    rxTestScheduler.flush();
    expect(v1).to.deep.equal(expected);
    expect(v2).to.deep.equal(expected);
  });

  it('should finalize generators if the subscription ends', () => {
    const iterator = {
      finalized: false,
      next() {
        return { value: 'duck', done: false };
      },
      return() {
        this.finalized = true;
      }
    };

    const iterable = {
      [Rx.Symbol.iterator]() {
        return iterator;
      }
    };

    const results = [];

    IteratorObservable.create(iterable)
      .take(3)
      .subscribe(
        x => results.push(x),
        null,
        () => results.push('GOOSE!')
      );

    expect(results).to.deep.equal(['duck', 'duck', 'duck', 'GOOSE!']);
    expect(iterator.finalized).to.be.true;
  });

  it('should finalize generators if the subscription and it is scheduled', () => {
    const iterator = {
      finalized: false,
      next() {
        return { value: 'duck', done: false };
      },
      return() {
        this.finalized = true;
      }
    };

    const iterable = {
      [Rx.Symbol.iterator]() {
        return iterator;
      }
    };

    const results = [];

    IteratorObservable.create(iterable, queue)
      .take(3)
      .subscribe(
        x => results.push(x),
        null,
        () => results.push('GOOSE!')
      );

    expect(results).to.deep.equal(['duck', 'duck', 'duck', 'GOOSE!']);
    expect(iterator.finalized).to.be.true;
  });

  it('should emit members of an array iterator on a particular scheduler', () => {
    const source = IteratorObservable.create(
      [10, 20, 30, 40],
      rxTestScheduler
    );

    const values = { a: 10, b: 20, c: 30, d: 40 };

    expectObservable(source).toBe('(abcd|)', values);
  });

  it('should emit members of an array iterator on a particular scheduler, ' +
  'but is unsubscribed early', (done: MochaDone) => {
    const expected = [10, 20, 30, 40];

    const source = IteratorObservable.create(
      [10, 20, 30, 40],
      Rx.Scheduler.queue
    );

    const subscriber = Rx.Subscriber.create(
      (x: number) => {
        expect(x).to.equal(expected.shift());
        if (x === 30) {
          subscriber.unsubscribe();
          done();
        }
      }, (x) => {
        done(new Error('should not be called'));
      }, () => {
        done(new Error('should not be called'));
      });

    source.subscribe(subscriber);
  });

  it('should emit characters of a string iterator', (done: MochaDone) => {
    const expected = ['f', 'o', 'o'];
    IteratorObservable.create('foo')
      .subscribe(
        (x: number) => { expect(x).to.equal(expected.shift()); },
        (x) => {
          done(new Error('should not be called'));
        }, () => {
          expect(expected.length).to.equal(0);
          done();
        }
      );
  });

  it('should be possible to unsubscribe in the middle of the iteration', (done: MochaDone) => {
    const expected = [10, 20, 30];

    const subscriber = Rx.Subscriber.create(
      (x: number) => {
        expect(x).to.equal(expected.shift());
        if (x === 30) {
          subscriber.unsubscribe();
          done();
        }
      }, (x) => {
        done(new Error('should not be called'));
      }, () => {
        done(new Error('should not be called'));
      }
    );

    IteratorObservable.create([10, 20, 30, 40, 50, 60]).subscribe(subscriber);
  });
});
