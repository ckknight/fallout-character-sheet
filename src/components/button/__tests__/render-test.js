/* globals describe it */
import { h } from '@cycle/dom';
import chai from 'chai';
const {expect} = chai;
import chaiVirtualDom from 'chai-virtual-dom';
chai.use(chaiVirtualDom);

import renderButton from '../render';

describe('button/render', () => {
    it('renders a <button>', () => {
        const key = 'dummy';
        const props = {
            disabled: true,
            color: 'blue'
        };
        const vTree = h('alpha');
        const expected = h(`button.${key}`, {
            key,
            ...props
        }, [vTree]);

        const actual = renderButton(key, props, vTree);

        expect(actual).to.look.exactly.like(expected);
    });
});
