import { h } from '@cycle/dom';

export default function renderLoading(name) {
    return h('span.loading', ['Loading ' + name + '...']);
}
