/* globals describe it */
import { h } from '@cycle/dom';
import chai from 'chai';
const {expect} = chai;
import chaiVirtualDom from 'chai-virtual-dom';
chai.use(chaiVirtualDom);

import renderError from '../render';

describe('errorHandler/render', () => {
    it('renders a <span>', () => {
        const name = 'dummy';
        const error = new Error();
        const expected = h(`span.error`, [`Error with ${name}: ${error}`]);

        const actual = renderError(name, error);

        expect(actual).to.look.exactly.like(expected);
    });
});
