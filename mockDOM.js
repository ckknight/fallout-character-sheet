import { Rx } from '@cycle/core';

function mockedSelection(data) {
    return {
        events(event) {
            return data[event] || Rx.Observable.never();
        },
    };
}

export default function mockDOM(data) {
    return {
        select(selector) {
            return mockedSelection(data[selector] || {});
        },
    };
}
