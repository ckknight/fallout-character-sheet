import { h } from '@cycle/dom';

export default function loading(key) {
    return h(`span.loading.loading-${key}`, ['Loading ' + key + '...']);
}
