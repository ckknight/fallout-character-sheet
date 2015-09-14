export default function getBooleanClassString(value, type) {
    return `.boolean.boolean-${!!value}${type ? '.boolean-' + type : ''}`;
}
