const { generateReply } = require("./agent/ollama");

(async () => {

    const tweet = {

        author: {
            username: "FabrizioRomano"
        },

        tweet: {
            text: "Vinicius Junior was right in clashing with Xabi Alonso. Alosno was a prick and he didnt play to the player's strenghts as Real Madrid's coach"
        }

    };

    const reply = await generateReply(tweet);

    console.log(reply);

})();