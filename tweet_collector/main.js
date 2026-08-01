const { chromium } = require("playwright");
const { generateReply } = require("../agent/ollama");
const collectedTweets = [];
const seenTweetIds = new Set();

const MAX_AI_REPLIES = 5;
let aiRepliesGenerated = 0;

function parseTweet(article) {

    const tweetText = article.querySelector('[data-testid="tweetText"]')?.innerText ?? "";

    const user = article.querySelector('[data-testid="User-Name"]');

    const userLines = user?.innerText.split("\n") ?? [];

    const displayName = userLines[0] ?? "";

    const username = (userLines.find(line => line.startsWith("@")) ?? "").replace("@", "");

    const verified = article.querySelector('[data-testid="icon-verified"]') !== null;

    const links =
        [...new Set(
            [...article.querySelectorAll("a")]
                .map(a => a.href)
        )];

    const profileUrl =
        links.find(link =>
            /^https:\/\/x\.com\/[^/]+$/.test(link)
        ) ?? null;

    const tweetUrl =
        links.find(link =>
            /\/status\/\d+$/.test(link)
        ) ?? null;

    const tweetId = tweetUrl?.match(/status\/(\d+)/)?.[1] ?? null;

    const images =
        [...article.querySelectorAll("img")]
            .map(img => img.src)
            .filter(src =>
                src.includes("pbs.twimg.com/media")
            );

    return {

        id: tweetId,

        author: {
            displayName,
            username,
            profileUrl,
            verified
        },

        tweet: {
            text: tweetText,
            images
        }

    };

}

async function collectVisibleTweets(page) {

    const tweets = await page.evaluate(() => {

        function parseTweet(article) {

            const tweetText = article.querySelector('[data-testid="tweetText"]')?.innerText ?? "";

            const user = article.querySelector('[data-testid="User-Name"]');

            const userLines = user?.innerText.split("\n") ?? [];

            const displayName = userLines[0] ?? "";

            const username = (userLines.find(line => line.startsWith("@")) ?? "").replace("@", "");

            const verified = article.querySelector('[data-testid="icon-verified"]') !== null;

            const links =
                [...new Set(
                    [...article.querySelectorAll("a")]
                        .map(a => a.href)
                )];

            const profileUrl =
                links.find(link =>
                    /^https:\/\/x\.com\/[^/]+$/.test(link)
                ) ?? null;

            const tweetUrl =
                links.find(link =>
                    /\/status\/\d+$/.test(link)
                ) ?? null;

            const tweetId =
                tweetUrl?.match(/status\/(\d+)/)?.[1] ?? null;

            const images =
                [...article.querySelectorAll("img")]
                    .map(img => img.src)
                    .filter(src =>
                        src.includes("pbs.twimg.com/media")
                    );

            return {

                id: tweetId,

                author: {
                    displayName,
                    username,
                    profileUrl,
                    verified
                },

                tweet: {
                    text: tweetText,
                    images
                }

            };

        }

        return [...document.querySelectorAll("article")]
            .map(parseTweet);

    });

    let newTweets = 0;

    for (const tweet of tweets) {

        if (!tweet.id)
            continue;

        if (seenTweetIds.has(tweet.id))
            continue;

        seenTweetIds.add(tweet.id);

        collectedTweets.push(tweet);

        newTweets++;

        if (aiRepliesGenerated < MAX_AI_REPLIES) {
            aiRepliesGenerated++;
            console.log(
                `\n[${collectedTweets.length}] @${tweet.author.username}`
            );

            console.log("\nTweet:");
            console.log(tweet.tweet.text);

            console.log("\nGenerating reply...\n");
            const reply = await generateReply(tweet);
            console.log("Reply:");
            console.log(reply);
        }

        console.log("\n----------------------------------------");

    }

    return newTweets;

}

async function scroll(page) {

    await page.evaluate(() => {

        window.scrollBy(0, window.innerHeight * 2);

    });

}

async function waitForMoreTweets(page, previousCount) {

    try {

        await page.waitForFunction(

            count =>
                document.querySelectorAll("article").length > count,

            previousCount,

            {
                timeout: 3000
            }

        );

    }

    catch {

    }

}

(async () => {

    const browser =
        await chromium.connectOverCDP(
            "http://localhost:9222"
        );

    const context =
        browser.contexts()[0];

    const page =
        context.pages().find(p =>
            p.url().includes("x.com")
        );

    if (!page) {

        console.log("No X tab found.");

        return;

    }

    await page.bringToFront();

    console.log("Connected to X");

    while (true) {

        const previousCount =
            await page.locator("article").count();

        const newTweets =
            await collectVisibleTweets(page);

        if (newTweets > 0) {

            console.log(
                `Collected ${collectedTweets.length} unique tweets`
            );

        }

        await scroll(page);

        await waitForMoreTweets(page, previousCount);

    }

})();