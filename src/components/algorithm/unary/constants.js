const operatorToName = {};
const operationsByOperator = {
    not: x => !x,
    floor: Math.floor,
    ceil: Math.ceil,
    abs: Math.abs,
};

export default {
    operatorToName,
    operationsByOperator,
};
