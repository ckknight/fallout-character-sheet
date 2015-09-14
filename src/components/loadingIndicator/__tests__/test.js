/* globals describe it */
import { h } from '@cycle/dom';
import loadingIndicator from '..';
import chai from 'chai';
const {expect} = chai;
import chaiVirtualDom from 'chai-virtual-dom';
chai.use(chaiVirtualDom);

describe('loadingIndicator', () => {
    it('renders a loading indicator with the provided key', () => {
        const key = 'dummy';
        const expected = h(`span.loading.loading-${key}`, ['Loading ' + key + '...']);

        const actual = loadingIndicator(key);

        expect(actual).to.look.like(expected);
    });
});
