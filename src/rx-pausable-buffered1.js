import { Rx } from '@cycle/core';

Rx.Observable.prototype.pausableBuffered1 = function pausableBuffered1(pauser) {
    return Rx.Observable.combineLatest(
        pauser,
        this.map((value, index) => ({
                value,
                index,
        })),
        (running, {value, index}) => ({
                value,
                index,
                running,
        }))
        .filter(x => x.running)
        .distinctUntilChanged(x => x.index)
        .pluck('value');
};
