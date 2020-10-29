const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
let fs = require('fs');
const fbiurl = "https://www.fbi.gov/wanted/kidnap";
let missingpersons = [];
let fbimissingpersondatafile = "fbimissingpersondata.txt"

// function for geting intial links of missing persons from fbi url
let storeInitialFBIData = async () => {
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
    // creating object to write to a file which contains name of missing person and thier detials link
    persons.forEach((el, idx) =>  {
        missingpersons.push({
            name: removeNewLineCharactersFromPersonsName(el),
            link:  personslink[idx]
        })
    });
    function removeNewLineCharactersFromPersonsName(person) {
        return person.replace(/\n/g, "");
    }

    fs.writeFile(fbimissingpersondatafile, JSON.stringify(missingpersons), err => {
        if(err) console.log(err);
        console.log("Saved.")
    })
  
    browser.close();
  };

// function for geting details of each missing person from fbi missing person url
  let getPersonsFromFBIData = async (link) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let alldetails = [];
  
    await page.goto(link, { waitUntil: 'networkidle0' });

    let details = await page.evaluate(() => Array.from(document.querySelectorAll('.wanted-person-details > p'), element => element.textContent));
    details.forEach(el => alldetails.push({details: el}));
    
    console.log(alldetails);

    browser.close();
  };

fs.readFile(fbimissingpersondatafile, async (err, data) => {
    if(err) console.log(err);
    let details = JSON.parse(data);
    for(let i = 0; i <= details.length; i++) {
        await getPersonsFromFBIData(details[i].link);
    }
})








async function getalldata() {
    await storeInitialFBIData();
}

//getalldata();
