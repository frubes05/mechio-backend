const puppeteer = require('puppeteer');
const fs = require("fs");
const path = './scrappedData.json';

let subPages = [];

(async () => {
  const browser = await puppeteer.launch({headless: true, args: [
    '--disable-extensions-except=/path/to/manifest/folder/',
    '--load-extension=/path/to/manifest/folder/',
  ]});
  const page = await browser.newPage();
  await page.goto('https://www.google.com/search?q=kako+napisati+%C5%BEivotopis&sxsrf=ALiCzsZz29ucB3udP7Uw9a_nvnP7Zi6w2w%3A1668338384877&source=hp&ei=0NJwY7CvMvWA9u8PhaKo0A4&iflsig=AJiK0e8AAAAAY3Dg4BOxmGj8niPdm4jvIegtZzT4ltXX&ved=0ahUKEwiw16vmhKv7AhV1gP0HHQURCuoQ4dUDCAg&uact=5&oq=kako+napisati+%C5%BEivotopis&gs_lcp=Cgdnd3Mtd2l6EAM6BAgjECc6CAgAEIAEELEDOgsIABCABBCxAxCDAToOCC4QgAQQsQMQxwEQ0QM6BAgAEEM6BwguELEDEEM6BAguEEM6FAguEIMBEK8BEMcBENQCELEDEIAEOgcILhDUAhBDOgsILhCDARCxAxCABDoFCAAQgAQ6CAguEIAEELEDOgUIABCxAzoICAAQsQMQgwFQAFizNWC9NmgCcAB4AIABnQGIAesRkgEEMjEuNJgBAKABAQ&sclient=gws-wiz')

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
          const paragraph = Array.from(document.querySelectorAll('p')).find(elem => elem.textContent.toUpperCase().includes('životopis'.toUpperCase()));
          if (title && img && paragraph.textContent) {
              return {url: window.location.href, title: title.innerHTML, img: img.src, paragraph: paragraph.textContent};
          }
      });
      subPages.push(newResults);
    }
  }

  await browser.close();

  if (!fs.existsSync(path)) {
    fs.writeFile('scrappedData.json', JSON.stringify(subPages), () => {
        console.log('Added scrapped data!');
    })
  }

})();
