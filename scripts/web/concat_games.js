const fs = require("fs");

const gamesWithChoicesDir = "data/humble_games.json";
const choicesGamesDir = "data/choice_games.json";
const CHOICE_FLAG = "Humble Choice";
const gamesDir = "data/games.json";

(() => {
  const gamesWithChoices = JSON.parse(
    fs.readFileSync(gamesWithChoicesDir, { encoding: "utf8", flag: "r" })
  );

  const choicesGames = JSON.parse(
    fs.readFileSync(choicesGamesDir, { encoding: "utf8", flag: "r" })
  );

  console.log(gamesWithChoices);

  const allGames = [];

  for (let i = 0; i < gamesWithChoices.length; i++) {
    const game = gamesWithChoices[i];

    if (game.platform === CHOICE_FLAG) {
      allGames.push(
        ...choicesGames.filter(
          (choicesGame) => choicesGame.extra.url === game.link
        )
      );
    } else {
      allGames.push(game);
    }
  }

  console.log(allGames);

  fs.writeFileSync(gamesDir, JSON.stringify(allGames, null, 2));
})();
