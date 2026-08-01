const { default: ollama } = require("ollama");
const systemPrompt = require("./prompt");

async function generateReply(tweet) {

    const response = await ollama.chat({

        model: "qwen3:8b",
        think: "low",

        messages: [

            {
                role: "system",
                content: systemPrompt
            },

            {
                role: "user",
                content:
                    `Tweet:

                    ${tweet.tweet.text}

                    Author:
                    @${tweet.author.username}`
            }

        ]

    });

    return response.message.content.trim();

}

module.exports = {
    generateReply
};