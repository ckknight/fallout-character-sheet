import createExpected from './createExpected';

export default function createHotObservable(scheduler, object) {
    return scheduler.createHotObservable.apply(scheduler, createExpected(object));
}
