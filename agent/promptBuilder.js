const identity = require("./identity");
const rules = require("./rules");
const examples = require("./examples");

function buildSystemPrompt() {
    return [
        identity,
        rules,
        examples
    ].join("\n\n");
}

module.exports = {
    buildSystemPrompt
};