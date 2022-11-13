const puppeteer = require('puppeteer');
const fs = require("fs");
const path = './scrapping/data/getEmployee.json';

let subPages = [];

(async () => {
  const browser = await puppeteer.launch({headless: true, args: [
    '--disable-extensions-except=/path/to/manifest/folder/',
    '--load-extension=/path/to/manifest/folder/',
  ]});
  const page = await browser.newPage();
  await page.goto('https://www.google.com/search?q=kako+prona%C4%87i+zaposlenika&oq=kak&aqs=chrome.0.69i59l3j69i57j46i131i175i199i433i512j69i60l2j69i61.1358j0j1&sourceid=chrome&ie=UTF-8')

  const searchResultLinks = await page.evaluate(() => {
    const titles = document.querySelectorAll('[data-header-feature]');
    const linksArr = [];
    titles.forEach(title => {
        const anchor = title.querySelector('a').href;
        linksArr.push(anchor);
    })
    return linksArr;
  });

  for (let link of searchResultLinks) {
    if (!link.includes('docx')) {
      await page.goto(link);
      const newResults= await page.evaluate(() => {
          const title = document.querySelector('h1');
          const img = document.querySelector('img');
          const paragraph = Array.from(document.querySelectorAll('p')).find(elem => elem.innerHTML.toUpperCase().includes('zaposlenik'.toUpperCase() || 'kandidat'.toUpperCase() || 'oglas'.toUpperCase()));
          if (title && img && paragraph && paragraph.textContent) {
              return {url: window.location.href, title: title.innerHTML, img: img.src, paragraph: paragraph.textContent};
          }
      });
      subPages.push(newResults);
    }
  }

  await browser.close();

  if (!fs.existsSync(path)) {
    fs.writeFile('./scrapping/data/getEmployee.json', JSON.stringify(subPages), () => {
        console.log('Added scrapped data!');
    })
  }

})();
