import { Rx } from '@cycle/core';

function makeLocalStorageSourceDriver(keyName) {
    return () => Rx.Observable.return(localStorage.getItem(keyName));
}

function makeLocalStorageSinkDriver(keyName) {
    return keyValue$ => {
        keyValue$.subscribe(keyValue => {
            localStorage.setItem(keyName, keyValue);
        });
    };
}

export default {
    makeLocalStorageSinkDriver,
    makeLocalStorageSourceDriver,
};
