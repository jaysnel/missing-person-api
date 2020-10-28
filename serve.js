const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const mainurl = "https://www.fbi.gov/wanted/kidnap";

// async function getMissingPersonInfo() {
//     const html = await axios.get(mainurl);
//     const $ = await cheerio.load(html.data);
//     //window.scrollBy(0, document.body.scrollHeight);
//     let data = [];

//     $('.portal-type-person').each((i, elem) => {
//           data.push({
//             image: $(elem).find('img').attr('src'),
//             name: $(elem).find('.title a').text(),
//             link: $(elem).find('.title a').attr('href')
//           })
//       });
    
//       console.log(JSON.stringify(data));
//       console.log(data.length);
// }

// getMissingPersonInfo();


(async () => {
    //const browser = await puppeteer.launch({headless: false});
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto(mainurl);
    await page.evaluate(() => {
        window.scrollBy(0, document.body.scrollHeight);
      });
    await page.waitForTimeout(1000);

    let persons = await page.evaluate(() => {
        return document.querySelectorAll('.portal-type-person');
        //return document.querySelector('.portal-type-person');
    });

    //console.log(persons);
    for(let data in persons) {
        console.log(persons[data]);
    }
  
    browser.close();
  })();