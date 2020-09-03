const core = require("@actions/core");
const fs = require("fs");

async function main() {
    try {
        let file = core.getInput('file', {required: true});
        let field = core.getInput('field', {required: true});
        let value = core.getInput('value', {required: true});
        let parseJson = !!core.getInput('parse_json', {required: false});
        if (parseJson) {
            value = JSON.parse(value)
        }

        let data = fs.readFileSync(file, 'utf8');
        let obj = JSON.parse(data);
        let root = obj;

        let parts = field.split(".");
        parts.forEach((part, index) => {
            let isLastItem = index === parts.length - 1;
            if (isLastItem) {
                obj[part] = value;
            } else {
                obj[part] = obj[part] || {}
                obj = obj[part];
            }
        });

        data = JSON.stringify(root, null, 2);
        fs.writeFileSync(file, data, 'utf8');

    } catch (error) {
        core.setFailed(error.message);
        throw error;
    }
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch(e => {
            console.error(e);
            process.exit(1);
        });
}
