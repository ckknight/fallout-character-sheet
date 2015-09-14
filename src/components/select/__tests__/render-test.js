/* globals describe it */
import { h } from '@cycle/dom';
import chai from 'chai';
const {expect} = chai;
import chaiVirtualDom from 'chai-virtual-dom';
chai.use(chaiVirtualDom);

import renderSelect from '../render';
import * as FIXTURES from './fixtures';

describe('select/render', () => {
    [false, true].forEach(withFallback => describe(`${withFallback ? 'with' : 'without'} fallback`, () => {
            describe('without a value', () => {
                it('renders a <select>', () => {
                    const key = 'dummy';
                    const className = 'dummy-class';
                    const options = FIXTURES.options;
                    const fallbackText = 'Fallback Text';
                    const props = withFallback ? {
                        className,
                        fallback: fallbackText,
                    } : {
                        className,
                    };
                    const expected = h(`select.${key}`, {
                        className,
                    }, (withFallback ? [h('option', {
                        selected: true,
                    }, [fallbackText])] : []).concat(options
                        .map(({value, text}) => h('option', {
                                value,
                            }, [text]))));

                    const actual = renderSelect(key, options, null, props);

                    expect(actual).to.look.exactly.like(expected);
                });
            });

            describe('with a value', () => {
                it('renders a <select> with that option selected', () => {
                    const key = 'dummy';
                    const options = FIXTURES.options;
                    const selectedOption = options[1].value;
                    const props = withFallback ? {
                        fallback: 'Fallback Text',
                    } : null;
                    const expected = h(`select.${key}`, options
                        .map(({value, text}) => h('option', {
                                value,
                                selected: value === selectedOption,
                            }, [text])));

                    const actual = renderSelect(key, options, selectedOption, props);

                    expect(actual).to.look.exactly.like(expected);
                });
            });
        }));
});
