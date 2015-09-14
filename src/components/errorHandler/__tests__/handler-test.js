/* globals describe it */
import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
const {onNext, onError, onCompleted} = Rx.ReactiveTest;
import assertObservableDOM from '../../../__tests__/assertObservableDOM';
import { expect } from 'chai';

import errorHandler from '..';
import renderError from '../render';

describe('errorHandler', () => {
    it('can be used within a .catch', () => {
        const scheduler = new Rx.TestScheduler();
        const vTree$ = scheduler.createHotObservable(
            onNext(100, 'Alpha'),
            onNext(150, 'Bravo'),
            onError(200, 'Charlie'));
        const name = 'Dummy';

        const expected = [
            onNext(100, 'Alpha'),
            onNext(150, 'Bravo'),
            onNext(200, renderError(name, 'Charlie')),
            onCompleted(200),
        ];

        const actual = vTree$
            .catch(errorHandler(name));

        const actualDOM = scheduler.startWithTiming(() => actual, 50, 90, 1000).messages;
        assertObservableDOM(actualDOM, expected);
    });
});
