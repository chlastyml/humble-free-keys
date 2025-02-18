function main() {
  const list = document.getElementsByClassName("content-choice");

  const url = window.location.href;
  const bundle = document
    .getElementsByClassName("content-choices-title")
    .item(0)
    .getElementsByTagName("span")
    .item(0)
    .getHTML();
  const games = [];

  for (let i = 0; i < list.length; i++) {
    const el = list.item(i);

    const game = {
      name: null,
      platform: null,
      link: null,
      extra: {
        bundle,
        url,
      },
    };

    const isClaimed = el.getElementsByClassName("claimed-text").length > 0;

    if (isClaimed) {
      continue;
    }

    game.name = el
      .getElementsByClassName("content-choice-title")
      .item(0).innerHTML.trim();

    game.platform = el
      .getElementsByClassName("delivery-methods")
      .item(0)
      .children.item(0).ariaLabel;

    games.push(game);
  }

  console.log(games);
}

main();
