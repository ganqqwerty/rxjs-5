// v4-backwards-compatibility

import {ISubscription} from '../Subscription';

export class DisposableImpl implements ISubscription {

    private _disposed = false;

    constructor(private work: () => void) {}

    get closed() {
        return this._disposed;
    }

    get isDisposed() {
        return this._disposed;
    }

    unsubscribe(): void {
        if (!this._disposed) {
            this._disposed = true;
            if (this.work !== undefined) {
                this.work();
            }
        }
    }

    dispose: this['unsubscribe'];
};
DisposableImpl.prototype.dispose = function() { this.unsubscribe(); };

export class Disposable implements ISubscription {

    static create(fn: () => void): Disposable {
        return new DisposableImpl(fn);
    }

    static empty = new DisposableImpl(() => { /* noop */ });

    private constructor() {}

    get closed() {
        return true;
    }

    get isDisposed() {
        return true;
    }

    unsubscribe(): void {
        /* no op */
    }

    dispose: this['unsubscribe'];
};
Disposable.prototype.dispose = function() { this.unsubscribe(); };

export class CompositeDisposable implements ISubscription, Disposable {

    public closed: boolean;
    private disposables: ISubscription[];

    constructor(...disposables: ISubscription[]) {
        if (disposables.length > 0 && Array.isArray(disposables[0])) {
            this.disposables = disposables[0] as any as ISubscription[];
        } else {
            this.disposables = disposables;
        }
    }

    add(v: ISubscription) {
        if (this.closed) {
            v.dispose();
        } else {
            this.disposables.push(v);
        }
    }

    remove(v: ISubscription) {
        const index = this.disposables.indexOf(v);
        if (index !== -1) {
            const d = this.disposables.splice(index, 1)[0];
            d.dispose();
            return true;
        }
        return false;
    }

    toArray() {
        return this.disposables.slice();
    }

    get length() {
        return this.disposables.length;
    }

    unsubscribe() {
        if (this.closed) {
            return;
        }
        this.closed = true;
        const arr = this.disposables.slice();
        this.disposables = [];
        const length = arr.length;
        for (let i = 0; i < length; i++) {
            arr[i].dispose();
        }
    }

    get isDisposed() {
        return this.closed;
    }

    dispose: this['unsubscribe'];
}
CompositeDisposable.prototype.dispose = function() { this.unsubscribe(); };

export class SerialDisposable implements ISubscription, Disposable {
    public closed: boolean = false;
    private current: ISubscription;

    unsubscribe() {
        if (this.closed) {
            return;
        }
        this.closed = true;
        const current = this.current;
        this.current = undefined;
        if (current !== undefined) {
            current.dispose();
        }
    }

    getDisposable() {
        return this.current;
    }

    setDisposable(disposable: ISubscription) {
        if (this.closed) {
            if (disposable !== undefined) {
                disposable.dispose();
            }
        } else {
            const old = this.current;
            this.current = disposable;
            if (old !== undefined) {
                old.dispose();
            }
        }
    }

    get isDisposed() {
        return this.closed;
    }

    dispose: this['unsubscribe'];
};

SerialDisposable.prototype.dispose = function() { this.unsubscribe(); };

export class SingleAssignmentDisposable implements ISubscription, Disposable {
    public closed: boolean = false;
    private disposable: ISubscription;

    unsubscribe() {
        if (this.closed) {
            return;
        }
        this.closed = true;
        const disposable = this.disposable;
        this.disposable = undefined;
        if (disposable !== undefined) {
            disposable.dispose();
        }
    }

    getDisposable() {
        return this.disposable;
    }

    setDisposable(v: ISubscription) {
        if (this.disposable !== undefined) {
            throw new Error(`SerialDisposable already set`);
        }
        if (v !== undefined) {
            if (this.closed) {
                v.dispose();
            } else {
                this.disposable = v;
            }
        }
    }

    get isDisposed() {
        return this.closed;
    }

    dispose: this['unsubscribe'];
}
SingleAssignmentDisposable.prototype.dispose = function() { this.unsubscribe(); };

export class RefCountDisposable implements ISubscription {

    public closed = false;
    get isDisposed() {
        return this.closed;
    }
    private count = 0;
    private primaryDisposed = false;

    constructor(private subscription: ISubscription) {
    }

    unsubscribe() {
        if (this.primaryDisposed) {
            return;
        }
        this.primaryDisposed = true;
        this._disposeCheck();
    }

    private _disposeCheck() {
        if (!this.closed && this.primaryDisposed && this.count === 0) {
            this.closed = true;
            const sub = this.subscription;
            this.subscription = undefined;
            sub.dispose();
        }
    }

    getDisposable() {
        if (this.isDisposed) {
            return Disposable.empty;
        }
        this.count++;
        return new DisposableImpl(() => {
            this.count--;
            this._disposeCheck();
        });
    }

    dispose: this['unsubscribe'];
}
RefCountDisposable.prototype.dispose = function() { this.unsubscribe(); };

export type IDisposable = ISubscription;
