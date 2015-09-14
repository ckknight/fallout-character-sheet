/* globals describe it */
import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
const {onNext, onError, onCompleted} = Rx.ReactiveTest;
import assertObservableDOM from '../../../__tests__/assertObservableDOM';
import mockDOM from '../../../__tests__/mockDOM';
import { expect } from 'chai';

import button from '..';
import renderButton from '../render';
import renderError from '../../errorHandler/render';

describe('button', () => {
    describe('DOM', () => {
        it('renders a button', () => {
            const scheduler = new Rx.TestScheduler();
            const key = 'dummy';
            const DOM = mockDOM({});
            const vTree$ = scheduler.createHotObservable(
                onNext(100, 'Alpha'),
                onNext(150, 'Bravo'),
                onNext(200, ['Charlie', 'Delta']),
                onNext(250, h('span', ['Echo']))
            );
            const props$ = scheduler.createHotObservable(
                onNext(100, {
                    title: 'blue',
                }),
                onNext(225, {
                    title: 'red',
                }));
            const expected = [
                onNext(100, renderButton(key, {
                    title: 'blue',
                }, 'Alpha')),
                onNext(150, renderButton(key, {
                    title: 'blue',
                }, ['Bravo'])),
                onNext(200, renderButton(key, {
                    title: 'blue',
                }, ['Charlie', 'Delta'])),
                onNext(225, renderButton(key, {
                    title: 'red',
                }, ['Charlie', 'Delta'])),
                onNext(250, renderButton(key, {
                    title: 'red',
                }, h('span', ['Echo']))),
            ];

            const actual = button(key, {
                DOM,
                vTree$,
                props$,
            });

            const actualDOM = scheduler.startWithTiming(() => actual.DOM, 50, 90, 1000).messages;
            assertObservableDOM(actualDOM, expected);
        });

        it('handles errors with vTree$', () => {
            const scheduler = new Rx.TestScheduler();
            const key = 'dummy';
            const DOM = mockDOM({});
            const vTree$ = scheduler.createHotObservable(
                onError(100, 'Whoops')
            );
            const props$ = Rx.Observable.never();
            const expected = [
                onNext(100, renderError(key, 'Whoops')),
                onCompleted(100),
            ];

            const actual = button(key, {
                DOM,
                vTree$,
                props$,
            });

            const actualDOM = scheduler.startWithTiming(() => actual.DOM, 50, 90, 1000).messages;
            assertObservableDOM(actualDOM, expected);
        });

        it('handles errors with props$', () => {
            const scheduler = new Rx.TestScheduler();
            const key = 'dummy';
            const DOM = mockDOM({});
            const vTree$ = Rx.Observable.never();
            const props$ = scheduler.createHotObservable(
                onError(100, 'Whoopsie')
            );
            const expected = [
                onNext(100, renderError(key, 'Whoopsie')),
                onCompleted(100),
            ];

            const actual = button(key, {
                DOM,
                vTree$,
                props$,
            });

            const actualDOM = scheduler.startWithTiming(() => actual.DOM, 50, 90, 1000).messages;
            assertObservableDOM(actualDOM, expected);
        });
    });

    it('returns a value$ observable', () => {
        const scheduler = new Rx.TestScheduler();
        const key = 'dummy';
        const click$ = scheduler.createHotObservable(
            onNext(150),
            onNext(250),
            onNext(300),
            onNext(450));
        const DOM = mockDOM({
            [`.${key}`]: {
                click: click$,
            },
        });
        const vTree$ = Rx.Observable.return('Text');
        const props$ = scheduler.createHotObservable(
            onNext(100, {
                className: 'button',
            }));
        const expected = [
            onNext(150, true),
            onNext(250, true),
            onNext(300, true),
            onNext(450, true),
        ];

        const actual = button(key, {
            DOM,
            vTree$,
            props$,
        });

        const results = scheduler.startWithTiming(() => actual.value$, 50, 90, 1000);
        expect(results.messages).to.deep.equal(expected);
    });
});
