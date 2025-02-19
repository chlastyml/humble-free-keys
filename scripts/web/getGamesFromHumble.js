const puppeteer = require("puppeteer");
const fs = require("fs");

const sourceDir = "data/humble_games.json";

async function closeAllPages(browser) {
  const page = await browser.newPage();

  const pages = await browser.pages();
  for (let i = 0; i < pages.length - 1; i++) {
    await pages[i].close();
  }

  console.log("Všechny kromě první stránky zavřeny!");

  return page;
}

const HUMBLE_CHOICE_PLATFORM = "Humble Choice";

async function wait(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hideClaimedKeys(page) {
  await page.evaluate(() => {
    const className = "hide-redeemed";
    const checkbox = document.getElementsByName(className)[0];
    if (!checkbox.checked) {
      checkbox.click();
    }
  });
  await wait();
}

async function getPlatform(element) {
  return await element.evaluate((el) => {
    try {
      return el.children[0].children[0].children[0].title;
    } catch {
      return el.children[0].children[0].title;
    }
  });
}

async function getGameItem(page, element) {
  return await page.evaluate(
    (el, HUMBLE_CHOICE_PLATFORM) => {
      function getPlatform(el) {
        try {
          return el.children[0].children[0].children[0].title;
        } catch {
          return el.children[0].children[0].title;
        }
      }

      const game = {
        platform: getPlatform(el),
        name: el.children[1].children[0].innerText,
      };

      if (game.platform === HUMBLE_CHOICE_PLATFORM) {
        const link = el.children[2]?.children[0]?.href || null;
        return { ...game, link };
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
    },
    element,
    HUMBLE_CHOICE_PLATFORM
  );
}

async function getGamesForPage(page) {
  return await page.evaluate(() => {
    const table = document.querySelector(".unredeemed-keys-table");
    if (!table) return [];

    const gameElements = table.children[1]?.children || [];

    return Array.from(gameElements).map((el) => {
      function getPlatform(el) {
        try {
          return el.children[0].children[0].children[0].title;
        } catch {
          return el.children[0].children[0].title;
        }
      }

      const game = {
        platform: getPlatform(el),
        name: el.children[1].children[0].innerText,
      };

      if (game.platform === "Humble Choice") {
        const link = el.children[2]?.children[0]?.href || null;
        return { ...game, link };
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
    });
  });
}

async function getActualPage(page) {
  return await page.evaluate(() => {
    return Number(
      document.querySelector(".pagination .current")?.innerText || 1
    );
  });
}

async function getPagesLength(page) {
  return await page.evaluate(() => {
    const pages = document.querySelector(".pagination")?.children;
    return pages ? Number(pages[pages.length - 2].innerText) : 1;
  });
}

async function goToNextPage(page) {
  await page.evaluate(() => {
    const pages = document.querySelector(".pagination")?.children;
    if (pages) pages[pages.length - 1].click();
  });
  await wait();
}

async function goToFirstPage(page) {
  const actualPage = await getActualPage(page);
  if (actualPage !== 1) {
    await page.evaluate(() => {
      const pages = document.querySelector(".pagination")?.children;
      if (pages) pages[1].click();
    });
    await wait();
  }
}

async function main() {
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

  await page.goto("https://www.humblebundle.com/home/keys");

  await hideClaimedKeys(page);
  await goToFirstPage(page);

  let actualPage = 0;
  const pageLength = await getPagesLength(page);

  let games = [];

  while (actualPage < pageLength) {
    console.log(`Scraping page ${actualPage + 1} of ${pageLength}`);
    games = [...games, ...(await getGamesForPage(page))];
    await goToNextPage(page);
    actualPage = await getActualPage(page);
  }

  fs.writeFileSync(sourceDir, JSON.stringify(games, null, 2));

  await browser.close();
}

main();
