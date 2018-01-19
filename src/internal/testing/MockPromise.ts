// v4-backwards-compatibility
import { TestScheduler } from './TestScheduler';

export class MockPromise {
    private callbacks: ([Function, Function])[] = [];

    constructor(
        private scheduler: TestScheduler,
        private time: number,
        private value: any,
        private error: boolean
    ) {
        scheduler.schedule(() => {
            this.callbacks.forEach(([resolve, reject]) => {
                const cb = this.error ? reject : resolve;
                try {
                    cb(this.value);
                } catch (err) {
                    /* no op */
                }
            });
        }, time);
    }

    public then(resolve?: (v: any) => any, reject?: (err: any) => any) {
        if (!resolve) {
            resolve = function(v) { return v; };
        }
        if (!reject) {
            reject = function(err) { throw err; };
        }
        this.callbacks.push([resolve, reject]);
        return new MockPromise(this.scheduler, this.time, this.value, this.error);
    }
}
