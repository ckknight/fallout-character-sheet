import { Rx } from '@cycle/core';

// Get the right animation frame method
let requestAnimFrame;
let cancelAnimFrame;
const root = window;
if (root.requestAnimationFrame) {
    requestAnimFrame = root.requestAnimationFrame;
    cancelAnimFrame = root.cancelAnimationFrame;
} else if (root.mozRequestAnimationFrame) {
    requestAnimFrame = root.mozRequestAnimationFrame;
    cancelAnimFrame = root.mozCancelAnimationFrame;
} else if (root.webkitRequestAnimationFrame) {
    requestAnimFrame = root.webkitRequestAnimationFrame;
    cancelAnimFrame = root.webkitCancelAnimationFrame;
} else if (root.msRequestAnimationFrame) {
    requestAnimFrame = root.msRequestAnimationFrame;
    cancelAnimFrame = root.msCancelAnimationFrame;
} else if (root.oRequestAnimationFrame) {
    requestAnimFrame = root.oRequestAnimationFrame;
    cancelAnimFrame = root.oCancelAnimationFrame;
} else {
    requestAnimFrame = cb => {
        root.setTimeout(cb, 1000 / 60);
    };
    cancelAnimFrame = root.clearTimeout;
}

export default (function () {
    function scheduleNow(state, action) {
        const scheduler = this;
        const disposable = new Rx.SingleAssignmentDisposable();
        const id = requestAnimFrame(function () {
            !disposable.isDisposed && (disposable.setDisposable(action(scheduler, state)));
        });
        return new Rx.CompositeDisposable(disposable, Rx.Disposable.create(() => {
            cancelAnimFrame(id);
        }));
    }

    function scheduleRelative(state, dueTime, action) {
        const scheduler = this;
        const dt = Rx.Scheduler.normalize(dueTime);
        if (dt === 0) {
            return scheduler.scheduleWithState(state, action);
        }
        const disposable = new Rx.SingleAssignmentDisposable();
        const id = root.setTimeout(() => {
            if (!disposable.isDisposed) {
                disposable.setDisposable(action(scheduler, state));
            }
        }, dt);
        return new Rx.CompositeDisposable(disposable, Rx.Disposable.create(() => {
            root.clearTimeout(id);
        }));
    }

    function scheduleAbsolute(state, dueTime, action) {
        return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
    }

    return new Rx.Scheduler(Date.now, scheduleNow, scheduleRelative, scheduleAbsolute);
}());
