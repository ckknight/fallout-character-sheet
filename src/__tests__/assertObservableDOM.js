import chai from 'chai';
const {expect} = chai;
import chaiVirtualDom from 'chai-virtual-dom';
chai.use(chaiVirtualDom);

export default function assertObservableDOM(actual, expected) {
    expect(actual.length).to.equal(expected.length, `Equal length`);
    for (let i = 0; i < actual.length; ++i) {
        expect(actual[i].time).to.equal(expected[i].time, `Element #${i} time`);
        const actualNotification = actual[i].value;
        const expectedNotification = expected[i].value;
        expect(actualNotification.kind).to.equal(expectedNotification.kind, `Element #${i} kind`);
        if (actualNotification.kind === 'N') {
            expect(actualNotification.value).to.look.exactly.like(expectedNotification.value);
        } else if (typeof actualNotification.equals === 'function') {
            expect(actualNotification.equals(expectedNotification)).to.be.true;
        } else {
            expect(actual[i].equals(expected[i])).to.be.true;
        }
    }
}
