const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
let fs = require('fs');
const fbiurl = "https://www.fbi.gov/wanted/kidnap";
let missingpersons = [];

// function for geting intial links of missing persons from fbi url
(async () => {
    //const browser = await puppeteer.launch({headless: false});
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto(fbiurl);
    // https://www.fbi.gov/wanted/kidnap uses lazy loading so
    // im using window.scrollBy() to force all of the elements to load
    await page.evaluate(() => {
        window.scrollBy(0, document.body.scrollHeight);
      });
    // making sure there is enough time for the above to actually run
    await page.waitForTimeout(1000);

    let persons = await page.evaluate(() => Array.from(document.querySelectorAll('.portal-type-person > .title'), element => element.textContent));
    let personslink = await page.evaluate(() => Array.from(document.querySelectorAll('.portal-type-person > .title a'), element => element.getAttribute('href')));
      
    
    persons.forEach((el, idx) =>  {
        missingpersons.push({
            name: removeNewLineCharactersFromPersonsName(el),
            link:  personslink[idx]
        })
    });
    function removeNewLineCharactersFromPersonsName(person) {
        return person.replace(/\n/g, "");
    }
    //personslink.forEach(el =>  console.log(el));

    fs.writeFile('missingpersondata.txt', JSON.stringify(missingpersons), err => {
        if(err) console.log(err);
        console.log("Saved.")
    })
  
    browser.close();
  })();
