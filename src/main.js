const core = require("@actions/core");
const fs = require("fs");

const writer = require("./json-writer");

async function main() {
    try {
        let file = core.getInput('file', {required: true});
        let field = core.getInput('field', {required: true});
        let value = core.getInput('value', {required: true});
        let shouldSplitField = core.getInput('should_split_field', {required: false});
        shouldSplitField = shouldSplitField != 'false' 
        let parseJson = !!core.getInput('parse_json', {required: false});
        
        if (parseJson) {
            value = JSON.parse(value)
        }

        let data = fs.readFileSync(file, 'utf8');
        let obj = JSON.parse(data);
        obj = writer.write(obj, field, value, shouldSplitField);
        
        data = JSON.stringify(obj, null, 2);
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
