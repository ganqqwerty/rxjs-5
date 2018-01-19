// v4-backwards-compatibility

import { Notification } from '../Notification';
import { TestMessage } from './TestMessage';
import { SubscriptionLog } from './SubscriptionLog';

export const ReactiveTest = {
    /**
     * Default virtual time used for creation of observable sequences in unit tests.
     */
    created: 100,
    /**
     * Default virtual time used to dispose subscriptions in unit tests.
     */
    disposed: 1000,
    /**
     * Default virtual time used to subscribe to observable sequences in unit tests.
     */
    subscribed: 200,
    onNext: function(ticks: number, value: any): TestMessage {
        return { frame: ticks, notification: Notification.createNext(value) };
    },
    onError: function(ticks: number, err: any) {
        return { frame: ticks, notification: Notification.createError(err) };
    },
    onCompleted: function(ticks: number) {
        return { frame: ticks, notification: Notification.createComplete() };
    },
    subscribe: function(start: number, end?: number) {
        return new SubscriptionLog(start, end);
    }
};
