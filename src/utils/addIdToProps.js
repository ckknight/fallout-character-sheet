export default function addIdToProps(id, props) {
    if (!props) {
        return { className: id };
    }
    let {className} = props;
    if (className) {
        className += ' ' + id;
    } else {
        className = id;
    }
    return Object.assign({}, props, {
        className,
    });
}
