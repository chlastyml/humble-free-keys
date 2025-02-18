function main() {
  const list = document.getElementsByClassName("content-choice");

  const games = [];

  for (let i = 0; i < list.length; i++) {
    const el = list.item(i);

    const game = {
      name: null,
      platform: null,
      link: null,
    };

    const isClaimed = el.getElementsByClassName("claimed-text").length > 0;

    if (isClaimed) {
      continue;
    }

    game.name = el
      .getElementsByClassName("content-choice-title")
      .item(0).innerText;

    game.platform = el
      .getElementsByClassName("delivery-methods")
      .item(0)
      .children.item(0).ariaLabel;

    games.push(game);
  }

  console.log(games);
}

main();
