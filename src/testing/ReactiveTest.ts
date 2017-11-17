// v4-backwards-compatibility

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
    onNext: function() { /* no-op */ },
    onError: function() { /* no-op */ },
    onCompleted: function() { /* no-op */ },
};
