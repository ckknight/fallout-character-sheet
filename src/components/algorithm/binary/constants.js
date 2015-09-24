const operationsByOperator = {
    '+': (x, y) => (+x) + (+y),
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y,
    '=': (x, y) => x === y,
    '^': (x, y) => Math.pow(x, y),
    or: (x, y) => x || y,
    and: (x, y) => x && y,
    max: (x, y) => y > x ? y : x,
    min: (x, y) => y < x ? y : x,
    '<=': (x, y) => x <= y,
    '>=': (x, y) => x >= y,
};

const operatorToName = {
    '+': 'add',
    '-': 'sub',
    '*': 'mul',
    '/': 'div',
    '=': 'eq',
    '^': 'pow',
    or: 'or',
    and: 'and',
    max: 'max',
    min: 'min',
    '<=': 'lte',
    '>=': 'gte',
};

const rightIdentity = {
    '+': 0,
    '-': 0,
    '*': 1,
    '/': 1,
    '^': 1,
};

const leftIdentity = {
    '+': 0,
    '*': 1,
};

export default {
    operationsByOperator,
    operatorToName,
    rightIdentity,
    leftIdentity,
};
