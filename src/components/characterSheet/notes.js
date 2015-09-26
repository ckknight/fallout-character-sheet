// import { h } from '@cycle/dom';
import input from '../input';

export default function notesDialogue({DOM, value$}) {
    const textarea = input('notes', 'textarea', {
        DOM,
        value$,
    });

    return {
        DOM: textarea.DOM,
        value$: textarea.value$,
    };
}
