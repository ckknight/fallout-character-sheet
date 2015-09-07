import { Rx } from '@cycle/core';

function makeLocalStorageSourceDriver(keyName) {
    return () => Rx.Observable.return(localStorage.getItem(keyName));
}

function makeLocalStorageSinkDriver(keyName) {
    return function (keyValue$) {
        keyValue$.subscribe(keyValue => {
            console.log('setting to ', keyValue);
            localStorage.setItem(keyName, keyValue);
        });
    };
}

export default {
    makeLocalStorageSinkDriver,
    makeLocalStorageSourceDriver,
};
