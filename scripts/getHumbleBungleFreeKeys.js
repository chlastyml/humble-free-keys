const DELAY = 500;
const HUMBLE_CHOICE_PLATFORM = "Humble Choice";

async function wait() {
  return Promise.resolve((resolve) => {
    setTimeout(resolve, DELAY);
  });
}

async function hideClaimedKeys() {
  const className = "hide-redeemed";

  if (!document.getElementsByName(className)[0].checked) {
    document.getElementsByName(className)[0].click();

    await wait();
  }
}

function getPlatform(element) {
  try {
    return element.children.item(0).children.item(0).children.item(0).title;
  } catch {
    return element.children.item(0).children.item(0).title;
  }
}

function getGameItem(elements, index) {
  const game = {
    platform: getPlatform(elements.item(index)),
    name: elements.item(index).children.item(1).children.item(0).innerText,
  };

  if (game.platform === HUMBLE_CHOICE_PLATFORM) {
    const link = elements.item(index).children.item(2).children.item(0).href;

    return {
      ...game,
      link,
    };
  }

  return {
    ...game,
    link: null,
    releaseDate: null,
    score: null,
    lastUpdateDate: null,
    developer: null,
    publisher: null,
  };
}

function getGameForPage() {
  const table = document
    .getElementsByClassName("unredeemed-keys-table")
    .item(0);

  const gameElements = table.children[1].children;

  const games = [];

  for (let i = 0; i < gameElements.length; i++) {
    games.push(getGameItem(gameElements, i));
  }

  return games;
}

function getActualPage() {
  return Number(
    document
      .getElementsByClassName("pagination")
      .item(0)
      .getElementsByClassName("current")
      .item(0).innerText
  );
}

function getPagesLenght() {
  const pages = document.getElementsByClassName("pagination").item(0).children;

  return Number(pages.item(pages.length - 2).innerText);
}

async function goToNextPage() {
  const pages = document.getElementsByClassName("pagination").item(0).children;

  pages.item(pages.length - 1).click();

  await wait();
}

async function goToFirstPage() {
  if (getActualPage() !== 1) {
    const pages = document
      .getElementsByClassName("pagination")
      .item(0).children;

    pages.item(1).click();

    await wait();
  }
}

async function main() {
  await hideClaimedKeys();
  await goToFirstPage();

  let actualPage = 0;
  const pageLength = getPagesLenght();

  let games = [];

  while (actualPage < pageLength) {
    console.log(actualPage);

    games = [...games, ...getGameForPage()];

    await goToNextPage();
    actualPage = getActualPage();
  }

  return games;
}

console.log(await main());
