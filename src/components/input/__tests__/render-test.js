/* globals describe it */
import { h } from '@cycle/dom';
import chai from 'chai';
const {expect} = chai;
import chaiVirtualDom from 'chai-virtual-dom';
chai.use(chaiVirtualDom);

import renderInput from '../render';

describe('input/render', () => {
    describe('type=text', () => {
        const type = 'text';
        it('renders an <input>', () => {
            const key = 'dummy';
            const props = {
                disabled: true,
            };
            const value = 'hello';
            const expected = h(`input.${key}`, Object.assign({
                key,
                type: 'text',
                value,
            }, props));

            const actual = renderInput(key, type, value, props);

            expect(actual).to.look.exactly.like(expected);
        });
    });

    describe('type=textarea', () => {
        const type = 'textarea';
        it('renders a <textarea>', () => {
            const key = 'dummy';
            const props = {
                disabled: true,
            };
            const value = 'hello';
            const expected = h(`textarea.${key}`, Object.assign({
                key,
                value,
            }, props));

            const actual = renderInput(key, type, value, props);

            expect(actual).to.look.exactly.like(expected);
        });
    });

    describe('type=integer', () => {
        const type = 'integer';
        it('renders an <input>', () => {
            const key = 'dummy';
            const props = {
                disabled: true,
            };
            const value = 5.5;
            const expected = h(`input.${key}`, Object.assign({
                key,
                type: 'number',
                value: Math.floor(value),
                pattern: '[0-9]*',
            }, props));

            const actual = renderInput(key, type, value, props);

            expect(actual).to.look.exactly.like(expected);
        });
    });

    describe('type=number', () => {
        const type = 'number';
        it('renders an <input>', () => {
            const key = 'dummy';
            const props = {
                disabled: true,
            };
            const value = 5.5;
            const expected = h(`input.${key}`, Object.assign({
                key,
                type: 'number',
                value,
                pattern: /[0-9]*(?:\.[0-9]*)?/.source,
            }, props));

            const actual = renderInput(key, type, value, props);

            expect(actual).to.look.exactly.like(expected);
        });
    });

    describe('type=checkbox', () => {
        const type = 'checkbox';
        [false, true].forEach(checked => {
            describe('value=' + checked, () => {
                it('renders an <input>', () => {
                    const key = 'dummy';
                    const props = {
                        disabled: true,
                    };
                    const value = true;
                    const expected = h(`input.${key}`, Object.assign({
                        key,
                        type: 'checkbox',
                        value: key,
                        checked,
                    }, props));

                    const actual = renderInput(key, type, checked, props);

                    expect(actual).to.look.exactly.like(expected);
                });
            });
        });
    });
});
