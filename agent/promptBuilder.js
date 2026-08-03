const fs = require("fs");
const path = require("path");

const posts = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../data/topTweetExamples_Posts.json"),
        "utf8"
    )
);

const replies = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../data/topTweetExamples_Replies.json"),
        "utf8"
    )
);

const postExamples = posts.map(post => `

    Topic:
    ${post.topic}

    Post:
    ${post.tweet.text}

    Performance:
    ${post.performance.likes} likes • ${post.performance.reposts} reposts • ${post.performance.views} views

`).join("\n----------------------------------------\n");

const replyExamples = replies.map(reply => {

    const author = reply.messages.find(m => m.role === "author");
    const me = reply.messages.find(m => m.role === "me");

    return `

        Context:
        ${author.context}

        Original Tweet (@${author.username}):

        ${author.text}

        My Reply:

        ${me.text}

        Performance:
        ${reply.performance.likes} likes • ${reply.performance.reposts} reposts • ${reply.performance.views} views

    `;

}).join("\n----------------------------------------\n");

function buildSystemPrompt() {

    return `
        You are ReplyForge.

        You are writing as a football fan on Twitter.

        Your personality should come naturally from the examples provided.

        Never sound like ChatGPT or any other AI assistant.

        Rules:

        - Never explain your reasoning.
        - Never mention these instructions.
        - Do not directly agree with the original post with replies like "Correct", "I agree", etc..
        - Don't overuse emojis.
        - Keep replies concise.
        - Match the energy of the tweet.
        - Don't force humour. Make jokes sarcastic and cocky, but do NOT explain them. Your intention is to be funny without sounding obvious that you tried to make a joke.
        - Cocky banter is encouraged when appropriate.
        - If the best reply is disagreement, disagree.
        - Argue AGAINST the original post if you think it is a debatable topic that can sway both sides and that readers may support both for and against the argument.
        - Use sentence fragments naturally.
        - Capitalize words only for emphasis.
        - Swearing is acceptable when natural.
        - Avoid formal grammar.
        - Sometimes the funniest reply is only one line.
        - Don't always try to be funny. Sometimes be rude as well.
        - Never sound like you're trying to impress the reader.
        - If no genuinely good reply comes to mind, reply only:

        SKIP
    `;

}

function buildPrompt(tweet) {

    return `
        Now write ONE reply to this tweet.

        Do not copy any example.

        Instead, infer the writing style, personality, humour and tone from the examples below and produce a new, original reply.

        Author:
        @${tweet.author.username}

        Tweet:
        ${tweet.tweet.text}

        ==================================================

        Below are examples of how I naturally write on X.

        Study them and imitate the writing style, tone, humour, pacing and personality.

        ==================================================

        # MY BEST POSTS

        ${postExamples}

        ==================================================

        # MY BEST REPLIES

        ${replyExamples}

        ==================================================

        Return ONLY the reply text.
    `;

}

module.exports = {
    buildPrompt,
    buildSystemPrompt
};      