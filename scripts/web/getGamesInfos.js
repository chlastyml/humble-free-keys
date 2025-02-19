const puppeteer = require("puppeteer");
const fs = require("fs");

const gamesDir = "data/games.json";
const gamesFullDir = "data/games_full.json";
const errorDir = "data/error.txt";

function normaizeName(name = "") {
  return name.trim().replaceAll(" + ", " ").replaceAll(" ", "+").toLowerCase();
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
  const inputGames = JSON.parse(
    fs.readFileSync(gamesDir, { encoding: "utf8", flag: "r" })
  ); //.slice(0, 2);

  const loadedGames = JSON.parse(
    fs.readFileSync(gamesFullDir, { encoding: "utf8", flag: "r" })
  );

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

  const fullGames = loadedGames ?? [];
  const errors = [];

  const baseUrl = `https://www.google.com/search?q=steam+`;

  for (let i = 0; i < inputGames.length; i++) {
    const gameRaw = inputGames[i];

    if (loadedGames.find((g) => g.name === gameRaw.name)) {
      continue;
    }

    let gameWithInfo = {
      name: gameRaw.name,
      platform: gameRaw.platform.toLowerCase(),
    };

    if (gameRaw.extra) {
      gameWithInfo = { ...gameWithInfo, extra: gameRaw.extra };
    }

    let steamInfo = null;

    try {
      if (gameWithInfo.platform === "steam") {
        await page.goto(baseUrl + normaizeName(gameRaw.name), {
          waitUntil: "networkidle2",
        }); // Nahraď správnou URL

        await Promise.all([
          page.click("h3"),
          page.waitForNavigation({ waitUntil: "networkidle2" }),
        ]);

        steamInfo = await page.evaluate(() => {
          const url = window.location.href;

          const info_element = document
            .getElementsByClassName("glance_ctn_responsive_left")
            .item(0);

          const reviews_els = info_element
            .getElementsByClassName("user_reviews")
            .item(0)
            .getElementsByClassName("summary column");

          const score = reviews_els
            .item(reviews_els.length - 1)
            .innerText.replace("%", "");

          const release_date = info_element
            .getElementsByClassName("release_date")
            .item(0)
            .getElementsByClassName("date")
            .item(0).innerText;

          let last_update_date = null;

          try {
            last_update_date = info_element
              .getElementsByClassName("steamdb_last_update")
              .item(0)
              .getElementsByClassName("date")
              .item(0)
              .innerText.split("(")[0]
              .trim();
          } catch {}

          const developer_item = last_update_date ? 1 : 0;
          const publisher_item = last_update_date ? 2 : 1;

          const developer_el = document
            .getElementsByClassName("glance_ctn_responsive_left")
            .item(0)
            .getElementsByClassName("dev_row")
            .item(developer_item)
            .getElementsByTagName("a")
            .item(0);

          const developer = {
            name: developer_el.innerText,
            link: developer_el.href.split("?")[0],
          };

          const publisher_el = document
            .getElementsByClassName("glance_ctn_responsive_left")
            .item(0)
            .getElementsByClassName("dev_row")
            .item(publisher_item)
            .getElementsByTagName("a")
            .item(0);

          const publisher = {
            name: publisher_el.innerText,
            link: publisher_el.href.split("?")[0],
          };

          let price = null;

          try {
            price = {
              value: Number(
                document
                  .getElementsByClassName("game_purchase_price price")
                  .item(0)
                  .innerHTML.trim()
                  .split("(")[1]
                  //.replace(")", "")
                  .replace("€)", "")
                  .replace(",", ".")
              ),
              discount: 0,
            };
          } catch {
            try {
              price = {
                value: Number(
                  document
                    .getElementsByClassName("discount_final_price")
                    .item(0)
                    .innerHTML.trim()
                    .split("(")[1]
                    //.replace(")", "")
                    .replace("€)", "")
                    .replace(",", ".")
                ),
                discount: Number(
                  document
                    .getElementsByClassName("discount_pct")
                    .item(0)
                    .innerText.replace("-", "")
                    .replace("%", "")
                ),
              };
            } catch {}
          }

          let location = true;

          try {
            location =
              document
                .getElementsByClassName("notice_box_content")
                .item(0)
                .getElementsByTagName("b").length === 0;
          } catch {}

          const owned =
            document.getElementsByClassName("ds_owned_flag ds_flag").length ===
            1;

          return {
            link: url,
            score: Number(score),
            releaseDate: release_date,
            lastUpdateDate: last_update_date,
            developer,
            publisher,
            price,
            owned,
            location,
          };
        });
      }

      fullGames.push({ ...gameWithInfo, steamInfo });

      fs.writeFileSync(gamesFullDir, JSON.stringify(fullGames, null, 2));
    } catch {
      errors.push(gameWithInfo.name);

      fs.writeFileSync(errorDir, JSON.stringify(errors, null, 2));
    }
  }

  await browser.close();
}

main();
