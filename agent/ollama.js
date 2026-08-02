const { default: ollama } = require("ollama");
// const systemPrompt = require("./prompt");
const { buildSystemPrompt } = require("./promptBuilder");

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
                content:
                    `Tweet:

                    ${tweet.tweet.text}

                    Author:
                    @${tweet.author.username}`
            }

        ],

        options: {
            temperature: 1,
        }

    });
    return response.message.content.trim();
}

module.exports = {
    generateReply
};