import * as Rx from '../../src/Rx';
import * as chai from 'chai';
import marbleTestingSignature = require('../helpers/marble-testing'); // tslint:disable-line:no-require-imports

declare const { asDiagram, time };
declare const hot: typeof marbleTestingSignature.hot;
declare const cold: typeof marbleTestingSignature.cold;
declare const expectObservable: typeof marbleTestingSignature.expectObservable;
declare const expectSubscriptions: typeof marbleTestingSignature.expectSubscriptions;

declare const rxTestScheduler: Rx.TestScheduler;

let TestScheduler = Rx.TestScheduler,
    Subject = Rx.Subject,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted;

/** @test {bufferTime} */
describe('Observable.prototype.pausableBuffered', () => {
  before(() => {
    Array.prototype.assertEqual = function(this: any[], ...other: any[]) {
      chai.assert.deepEqual(this, other);
    };
  });
  after(() => {
    delete Array.prototype.assertEqual;
  });
  it('paused no skip', function () {
    let subscription;

    let scheduler = new TestScheduler();

    let controller = new Subject();

    let results = scheduler.createObserver();

    let xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.pausableBuffered_deprecated(controller).subscribe(results);
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 205, function () {
      controller.onNext(false);
    });

    scheduler.scheduleAbsolute(null, 209, function () {
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );
  });

  it('paused skips', function () {
    let subscription;

    let scheduler = new TestScheduler();

    let controller = new Subject();

    let results = scheduler.createObserver();

    let xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.pausableBuffered_deprecated(controller).subscribe(results);
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      controller.onNext(false);
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(400, 4),
      onNext(400, 5),
      onNext(400, 6),
      onCompleted(500)
    );
  });

  it('paused error', function () {
    let subscription;

    let err = new Error();
    let scheduler = new TestScheduler();

    let controller = new Subject();

    let results = scheduler.createObserver();

    let xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(230, err),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.pausableBuffered_deprecated(controller).subscribe(results);
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      controller.onNext(false);
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onError(230, err)
    );
  });

  it('paused skip initial elements', function(){
    let subscription;

    let scheduler = new TestScheduler();

    let controller = new Subject();

    let results = scheduler.createObserver();

    let xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(230, 2),
      onNext(270, 3),
      onCompleted(400)
    );

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.pausableBuffered_deprecated(controller).subscribe(results);
      controller.onNext(false);
    });

    scheduler.scheduleAbsolute(null, 280, function () {
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.start();
    results.messages.assertEqual(
      onNext(280, 2),
      onNext(280, 3),
      onCompleted(400)
    );
  });

  it('paused with observable controller and pause and unpause', function(){
    let subscription;

    let scheduler = new TestScheduler();

    let results = scheduler.createObserver();

    let xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onNext(450, 7),
      onNext(470, 8),
      onCompleted(500)
    );

    let controllerSwitch = new Rx.Subject();
    let controller = scheduler.createHotObservable(
      onNext(201, true),
      onNext(300, false),
      onNext(400, true)
    ).merge(controllerSwitch);

    let pausableBuffered = xs.pausableBuffered_deprecated(controller);

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = pausableBuffered.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, 460, function () {
      controllerSwitch.onNext(false);
    });

    scheduler.scheduleAbsolute(null, 480, function () {
      controllerSwitch.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(400, 4),
      onNext(400, 5),
      onNext(400, 6),
      onNext(450, 7),
      onNext(480, 8),
      onCompleted(500)
    );
  });

  it('paused with immediate unpause', function(){
    let subscription;

    let scheduler = new TestScheduler();

    let results = scheduler.createObserver();

    let xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(500)
    );

    let controller = Rx.Observable.just(true);

    let pausableBuffered = xs.pausableBuffered_deprecated(controller);

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = pausableBuffered.subscribe(results);
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onCompleted(500)
    );

  });

  it('paused when finishing', function () {
    let subscription;

    let scheduler = new TestScheduler();

    let results = scheduler.createObserver();

    let xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onNext(450, 7),
      onNext(470, 8),
      onCompleted(500)
    );

    let controllerSwitch = new Rx.Subject();
    let controller = scheduler.createHotObservable(
      onNext(201, true),
      onNext(300, false),
      onNext(400, true)
    ).merge(controllerSwitch);

    let pausableBuffered = xs.pausableBuffered_deprecated(controller);

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = pausableBuffered.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, 460, function () {
      controllerSwitch.onNext(false);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(400, 4),
      onNext(400, 5),
      onNext(400, 6),
      onNext(450, 7)
    );
  });

  it('paused with observable controller and pause and unpause after end', function () {
    let scheduler = new TestScheduler();

    let xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onNext(450, 7),
      onNext(470, 8),
      onCompleted(500)
    );

    let controller = scheduler.createHotObservable(
      onNext(201, true),
      onNext(300, false),
      onNext(600, true)
    );

    let results = scheduler.startScheduler(function () {
      return xs.pausableBuffered_deprecated(controller);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(600, 4),
      onNext(600, 5),
      onNext(600, 6),
      onNext(600, 7),
      onNext(600, 8),
      onCompleted(600)
    );
  });

  it('paused with observable controller and pause and unpause after error', function(){
    let error = new Error();

    let scheduler = new TestScheduler();

    let xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onNext(450, 7),
      onNext(470, 8),
      onError(500, error)
    );

    let controller = scheduler.createHotObservable(
      onNext(201, true),
      onNext(300, false),
      onNext(600, true)
    );

    let results = scheduler.startScheduler(function () {
      return xs.pausableBuffered_deprecated(controller);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(600, 4),
      onNext(600, 5),
      onNext(600, 6),
      onNext(600, 7),
      onNext(600, 8),
      onError(600, error)
    );
  });

  it('paused with state change in subscriber', function(){
    let subscription;

    let scheduler = new TestScheduler();

    let results = scheduler.createObserver();

    let xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(250, 3),
      onNext(270, 4),
      onNext(330, 5),
      onCompleted(500)
    );

    let controller = new Rx.Subject();

    let pausableBuffered = xs.pausableBuffered_deprecated(controller);

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = pausableBuffered.subscribe(
        function(value){
          results.onNext(value);
          controller.onNext(false);

          scheduler.scheduleRelative(null, 100, function () {
            controller.onNext(true);
          });
        },
        function (e) { results.onError(e); },
        function () { results.onCompleted(); }
      );

      controller.onNext(true);
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(310, 3),
      onNext(310, 4),
      onNext(410, 5),
      onCompleted(500)
    );
  });

  it('pausableBuffered produces expected result', function () {
    let data = new Rx.Subject();
    let signal = new Rx.Subject();
    let p = data.pausableBuffered_deprecated(signal);
    let results = [];
    p.subscribe(function (value) { results.push(value); });

    data.onNext(1);
    signal.onNext(false);
    signal.onNext(true);

    chai.assert.deepEqual(results, [1]);
  });

  it('paused with default controller and multiple subscriptions', function () {
    let paused, subscription, subscription2;

    let scheduler = new TestScheduler();

    let results = scheduler.createObserver();
    let results2 = scheduler.createObserver();

    let controller = new Rx.BehaviorSubject(false);

    let xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );

    scheduler.scheduleAbsolute(null, 200, function () {
      paused = xs.pausableBuffered_deprecated(controller);
      subscription = paused.subscribe(results);
      controller.onNext(true);
    });

    scheduler.scheduleAbsolute(null, 240, function () {
      subscription2 = paused.subscribe(results2);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
      subscription2.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );

    results2.messages.assertEqual(
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );
  });

  it('pausableBuffered is unaffected by currentThread scheduler', function () {
    let subscription;

    let scheduler = new TestScheduler();

    let controller = new Subject();

    let results = scheduler.createObserver();

    let xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );

    scheduler.scheduleAbsolute(null, 200, function () {
      Rx.Scheduler.currentThread.schedule(function () {
        subscription = xs.pausableBuffered_deprecated(controller).subscribe(results);
        controller.onNext(true);
      });
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(301, 4),
      onNext(350, 5),
      onNext(399, 6),
      onCompleted(500)
    );
  });

});