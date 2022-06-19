function write(obj, field, value) {
    const root = obj;
    const parts = field.split(".");
    parts.forEach((part, index) => {
        let isLastItem = index === parts.length - 1;

        if (isLastItem) {
            obj[part] = value;
        } else {
            // Resolve array indices [0]
            const matches = part.match(/([\w_+-]+)\[(-?\d)\]/);
            if(matches != null) {
                obj = obj[ matches[1]][matches[2]];
            } else {
                obj[part] = obj[part] || {}
                obj = obj[part];
            }
        }
    });

    return root;
}

module.exports = { write }