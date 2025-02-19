const puppeteer = require("puppeteer");
const fs = require("fs");

const sourceDir = "data/humble_games.json";
const targetDir = "data/choice_games.json";
const CHOICE_FLAG = "Humble Choice";

async function wait(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function closeAllPages(browser) {
  const page = await browser.newPage();

  const pages = await browser.pages();
  for (let i = 0; i < pages.length - 1; i++) {
    await pages[i].close();
  }

  console.log("Všechny kromě první stránky zavřeny!");

  return page;
}

async function main() {
  const choices = JSON.parse(
    fs.readFileSync(sourceDir, { encoding: "utf8", flag: "r" })
  ).filter((g) => g.platform === CHOICE_FLAG);

  //throw new Error("pause");

  const browser = await puppeteer.launch({
    headless: false, // Povinné pro rozšíření
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Cesta k nainstalovanému Chrome
    userDataDir: "C:\\Users\\Tomas\\AppData\\Local\\Google\\Chrome\\User Data", // Použití uživatelského profilu
    ignoreDefaultArgs: ["--disable-extensions"],
    args: [
      "--no-sandbox", // Obchází některé bezpečnostní omezení
      //"--disable-gpu", // Některé grafické karty mohou způsobovat problémy
      "--enable-automation", // Povolí automatizaci, ale povolí i rozšíření
      "--disable-blink-features=AutomationControlled", // Skryje Puppeteer před detekcí
      "--disable-features=site-per-process", // Pomáhá s některými omezeními
      "--disable-popup-blocking", // Povolení vyskakovacích oken
      "--disable-dev-shm-usage", // Zabrání problémům na systémech s omezenou pamětí
      //"--load-extension=C:\\Users\\Tomas\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions", // Načtení všech rozšíření
      //"--restore-last-session", // Obnoví poslední relaci, včetně rozšíření
      //"--start-maximized", // Otevře prohlížeč v maximalizovaném okně
      "--disable-logging", // Vypne některé logy
      "--log-level=3", // Snižuje úroveň logování (0=INFO, 3=ERROR)
    ],
  });

  const page = await closeAllPages(browser);

  // Set screen size.
  await page.setViewport({ width: 1080, height: 1024 });

  const choiseGames = [];

  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];

    await page.goto(choice.link); // Nahraď správnou URL

    const games = await page.evaluate(() => {
      const list = document.getElementsByClassName("content-choice");
      const url = window.location.href;

      const bundle = document
        .getElementsByClassName("content-choices-title")
        .item(0)
        .getElementsByTagName("span")
        .item(0)
        .innerHTML.replace(" games", "");

      const games = [];

      for (let i = 0; i < list.length; i++) {
        const el = list.item(i);

        const game = {
          name: null,
          platform: null,
          link: null,
          releaseDate: null,
          score: null,
          lastUpdateDate: null,
          developer: null,
          publisher: null,
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
          .item(0)
          .innerHTML.trim();

        game.platform = el
          .getElementsByClassName("delivery-methods")
          .item(0)
          .children.item(0).ariaLabel;

        games.push(game);
      }

      return games;
    });

    choiseGames.push(...games);
  }

  fs.writeFileSync(targetDir, JSON.stringify(choiseGames, null, 2));

  await browser.close();
}

main();
