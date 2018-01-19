import { expect } from 'chai';
import { bindCallback } from '../src/internal/observable/bindCallback';
import { bindNodeCallback } from '../src/internal/observable/bindNodeCallback';
import { combineLatest } from '../src/internal/observable/combineLatest';
import { concat } from '../src/internal/observable/concat';
import { defer } from '../src/internal/observable/defer';
import { empty } from '../src/internal/observable/empty';
import { forkJoin } from '../src/internal/observable/forkJoin';
import { from } from '../src/internal/observable/from';
import { fromEvent } from '../src/internal/observable/fromEvent';
import { fromEventPattern } from '../src/internal/observable/fromEventPattern';
import { fromPromise } from '../src/internal/observable/fromPromise';
import { _if } from '../src/internal/observable/if';
import { interval } from '../src/internal/observable/interval';
import { merge } from '../src/internal/observable/merge';
import { never } from '../src/internal/observable/never';
import { of } from '../src/internal/observable/of';
import { onErrorResumeNext } from '../src/internal/observable/onErrorResumeNext';
import { pairs } from '../src/internal/observable/pairs';
import { race } from '../src/internal/observable/race';
import { range } from '../src/internal/observable/range';
import { _throw } from '../src/internal/observable/throw';
import { timer } from '../src/internal/observable/timer';
import { using } from '../src/internal/observable/using';
import { zip } from '../src/internal/observable/zip';
import * as Rx from '../src/Rx';

describe('exports', () => {
  it('should have rxjs/observable/bindCallback', () => {
    expect(bindCallback).to.equal(Rx.Observable.bindCallback);
  });

  it('should have rxjs/observable/bindNodeCallback', () => {
    expect(bindNodeCallback).to.equal(Rx.Observable.bindNodeCallback);
  });

  it('should have rxjs/observable/combineLatest', () => {
    expect(combineLatest).to.equal(Rx.Observable.combineLatest);
  });

  it('should have rxjs/observable/concat', () => {
    expect(concat).to.equal(Rx.Observable.concat);
  });

  it('should have rxjs/observable/defer', () => {
    expect(defer).to.equal(Rx.Observable.defer);
  });

  it('should have rxjs/observable/empty', () => {
    expect(empty).to.equal(Rx.Observable.empty);
  });

  it('should have rxjs/observable/forkJoin', () => {
    expect(forkJoin).to.equal(Rx.Observable.forkJoin);
  });

  it('should have rxjs/observable/from', () => {
    expect(from).to.equal(Rx.Observable.from);
  });

  it('should have rxjs/observable/fromEvent', () => {
    expect(fromEvent).to.equal(Rx.Observable.fromEvent);
  });

  it('should have rxjs/observable/fromEventPattern', () => {
    expect(fromEventPattern).to.equal(Rx.Observable.fromEventPattern);
  });

  it('should have rxjs/observable/fromPromise', () => {
    expect(fromPromise).to.equal(Rx.Observable.fromPromise);
  });

  it('should have rxjs/observable/if', () => {
    expect(_if).to.equal(Rx.Observable.if);
  });

  it('should have rxjs/observable/interval', () => {
    expect(interval).to.equal(Rx.Observable.interval);
  });

  it('should have rxjs/observable/merge', () => {
    expect(merge).to.equal(Rx.Observable.merge);
  });

  it('should have rxjs/observable/never', () => {
    expect(never).to.equal(Rx.Observable.never);
  });

  it('should have rxjs/observable/of', () => {
    expect(of).to.equal(Rx.Observable.of);
  });

  it('should have rxjs/observable/onErrorResumeNext', () => {
    expect(onErrorResumeNext).to.equal(Rx.Observable.onErrorResumeNext);
  });

  it('should have rxjs/observable/pairs', () => {
    expect(pairs).to.equal(Rx.Observable.pairs);
  });

  it('should have rxjs/observable/race', () => {
    expect(race).to.equal(Rx.Observable.race);
  });

  it('should have rxjs/observable/range', () => {
    expect(range).to.equal(Rx.Observable.range);
  });

  it('should have rxjs/observable/throw', () => {
    expect(_throw).to.equal(Rx.Observable.throw);
  });

  it('should have rxjs/observable/timer', () => {
    expect(timer).to.equal(Rx.Observable.timer);
  });

  it('should have rxjs/observable/using', () => {
    expect(using).to.equal(Rx.Observable.using);
  });

  it('should have rxjs/observable/zip', () => {
    expect(zip).to.equal(Rx.Observable.zip);
  });
});
