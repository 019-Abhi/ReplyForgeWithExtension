console.log("Reply Forge Loaded");

function scanTimeline() {

    return [...document.querySelectorAll("article")]
        .map(parseTweet);

}

function waitForTweets() {

    if (document.querySelectorAll("article").length === 0) {
        requestAnimationFrame(waitForTweets);
        return;
    }

    const tweets = scanTimeline();

    console.table(
        tweets.map(t => ({
            user: t.author.username,
            text: t.tweet.text,
            id: t.id
        }))
    );

}

waitForTweets();