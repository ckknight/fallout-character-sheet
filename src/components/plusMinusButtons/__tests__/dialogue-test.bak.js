/* globals describe it before after */
import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
const {onNext} = Rx.ReactiveTest;
import assertObservableDOM from '../../../__tests__/assertObservableDOM';
import mockDOM from '../../../__tests__/mockDOM';
import { expect } from 'chai';
import mockery from 'mockery';
import sinon from 'sinon';

describe('plusMinusButtons', () => {
    let plusMinusButtons;
    let buttonStub;
    before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true,
        });
        buttonStub = sinon.stub();
        mockery.registerMock('../button', buttonStub);
        plusMinusButtons = require('..');
    });
    beforeEach(() => {
        buttonStub.reset();
    });
    after(mockery.disable.bind(mockery));

    it('returns a plusDOM observable', () => {
        const scheduler = new Rx.TestScheduler();
        const key = 'dummy';
        const text = 'Plus';
        const DOM = mockDOM({});
        const plusDOM = scheduler.createHotObservable(
            onNext(100, h('alpha')),
            onNext(150, h('bravo')));
        const plusStub = buttonStub.withArgs(`${key}-plus`)
            .returns({
                DOM: plusDOM,
                value$: Rx.Observable.never(),
            });
        buttonStub.withArgs(`${key}-minus`)
            .returns({
                DOM: Rx.Observable.never(),
                value$: Rx.Observable.never(),
            });
        const expected = [
            onNext(100, h('alpha')),
            onNext(150, h('bravo')),
        ];

        const actual = plusMinusButtons(key, text, '-', {
            DOM,
            value$: Rx.Observable.return(0),
            min$: Rx.Observable.return(0),
            max$: Rx.Observable.return(0),
        });

        const results = scheduler.startWithTiming(() => actual.plusDOM, 50, 90, 1000);
        assertObservableDOM(results.messages, expected);
        expect(plusStub.callCount).to.equal(1);
        console.log(plusStub.firstCall.args[1]);
    });

// it('returns a value$ observable', () => {
//     const scheduler = new Rx.TestScheduler();
//     const key = 'dummy';
//     const click$ = scheduler.createHotObservable(
//         onNext(150),
//         onNext(250),
//         onNext(300),
//         onNext(450));
//     const DOM = mockDOM({
//         [`button.${key}`]: {
//             click: click$,
//         },
//     });
//     const vTree$ = Rx.Observable.return('Text');
//     const props$ = scheduler.createHotObservable(
//         onNext(100, {
//             className: 'button',
//         }));
//     const expected = [
//         onNext(150, true),
//         onNext(250, true),
//         onNext(300, true),
//         onNext(450, true),
//     ];
//
//     const actual = button(key, {
//         DOM,
//         vTree$,
//         props$,
//     });
//
//     const results = scheduler.startWithTiming(() => actual.value$, 50, 90, 1000);
//     expect(results.messages).to.deep.equal(expected);
// });
});
