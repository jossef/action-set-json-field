function write(obj, field, value, shouldSplitField = true) {
    const root = obj;
    const parts = shouldSplitField ? field.split(".") : [ field ];
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