// v4-backwards-compatibility

import {ISubscription} from '../Subscription';

export const Disposable = {

};

export class SerialDisposable implements ISubscription {
    public closed: boolean = false;
    private current: ISubscription;

    dispose() {
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
    unsubscribe: this['dispose'];

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
};

SerialDisposable.prototype.unsubscribe = SerialDisposable.prototype.dispose;
