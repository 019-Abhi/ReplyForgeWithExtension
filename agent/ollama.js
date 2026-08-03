const { default: ollama } = require("ollama");
const { buildPrompt, buildSystemPrompt } = require("./promptBuilder");

async function generateReply(tweet) {

    const response = await ollama.chat({

        model: "qwen3:8b",

        think: "low",

        messages: [

            {
                role: "system",
                content: buildSystemPrompt()
            },

            {
                role: "user",
                content: buildPrompt(tweet)
            }

        ],

        options: {
            temperature: 1
        }

    });

    return response.message.content.trim();

}

module.exports = {
    generateReply
};