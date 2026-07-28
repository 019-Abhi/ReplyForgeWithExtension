function parseTweet(article) {

    const tweetText =
        article.querySelector('[data-testid="tweetText"]')?.innerText ?? "";

    const user =
        article.querySelector('[data-testid="User-Name"]');

    const userLines =
        user?.innerText.split("\n") ?? [];

    const displayName = userLines[0] ?? "";

    const username =
        (userLines.find(line => line.startsWith("@")) ?? "")
            .replace("@", "");

    const verified =
        article.querySelector('[data-testid="icon-verified"]') !== null;

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

window.parseTweet = parseTweet;