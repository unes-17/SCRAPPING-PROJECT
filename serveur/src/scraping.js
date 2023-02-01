const puppeteer = require('puppeteer');
const Product = require("./models/product");
const Category = require("./models/category");
const mongoose = require("mongoose");


mongoose.set("strictQuery", true);
mongoose
    .connect("mongodb://127.0.0.1/scrapped")
    .then(() => console.log("connected sucssufully !!"))
    .catch((err) => {
        console.log(err);
        mongoose.connection.close();
    });
const clearCollections = async () => {
    try {
        await Product.db.dropCollection("products");
        await Category.db.dropCollection("categories");
    } catch (error) {
        console.log("clearCollections : " + error);
        //mongoose.connection.close();
    }
};
const scrollDown = async (page) => {
    await page.evaluate(async () => {
        const distance = 50;
        let totalHeight = 0;
        while (totalHeight < document.body.scrollHeight) {
            totalHeight += distance;
            window.scrollBy(0, distance);
            await new Promise((resolve) => setTimeout(resolve, 250));
        }
    });
};

const savingData = async (products_list) => {
    try {
        let category;
        if (products_list?.length > 0) {
            category = await Category.findOne({
                name: products_list[0].category.name,
            });
            if (!category) {
                category = new Category({ name: products_list[0].category.name });
                category = await category.save();
            }
            products_list.forEach(async (product) => {
                product.category = category;
                const newProduct = new Product(product);
                await newProduct.save();
            });
        }
    } catch (error) {

    }
}

const sleep = async (t) => {
    return await new Promise((resolve) => setTimeout(resolve, t));
};

const acceptCookies = async (page) => {
    try {
        await sleep(5000);
        console.log("accepting coockies");
        const cookie_btn = await page.$(
            '[data-test="pwa-consent-layer-accept-all"]'
        );
        await cookie_btn?.evaluate((form) => form.click());
        await sleep(5000);
    } catch (error) {
        console.log("1 scrap : " + error);
    }
};

const scrap = async (url) => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp",
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "load" });
    await page.waitForSelector("#main-content");

    await acceptCookies(page);
    await scrollDown(page);

    let products_list = [];
    const products = await page.$$(
        '[data-test="mms-search-srp-productlist-item"]'
    );

    const category = await page.evaluate(() => {
        //get name of category
        const category = {
            name: document.querySelector("div > h1")?.outerText ?? "",
        };
        return category;
    });

    for (const product of products) {

        /*   const category_tmp = await page.querySelector(".BaseTypo-sc-1jga2g7-0 .dbMgHm .StyledInfoTypo-sc-1jga2g7-1 .dSMprm");
       //category
       let category = {
           name: await page.evaluate((el) => el.querySelector(".BaseTypo-sc-1jga2g7-0 .dbMgHm .StyledInfoTypo-sc-1jga2g7-1 .dSMprm").textContent, category_tmp)
       };*/
        //name
        const name = await page.evaluate((el) => el.querySelector("div > div > div > p").textContent, product);
        //url
        let url = await page.evaluate((el) => el.querySelector("div > a")?.getAttribute("href") ?? "", product);
        //image_url
        const image_url = await page.evaluate((el) => el.querySelector("div > picture > img")?.getAttribute("src") ?? "", product);
        //brand
        const brand = name.match(/-\s*(\w+\s*\w+)/)[1].split(" ")[0];
        //specifications
        const specifications =
            await page.evaluate((el) => el.querySelector('[data-test="feature-list"]')?.outerText.split("\n") ?? "", product);
        let specificationsArray = [];
        for (let i = 0; i < specifications.length; i += 2) {
            let key = specifications[i];
            let value = specifications[i + 1];
            specificationsArray.push({ key, value });
        }

        //price
        let price = [];
        price[0] = await page.evaluate((el) => el.querySelector("div > span.BaseTypo-sc-1jga2g7-0.dbMgHm.StyledInfoTypo-sc-1jga2g7-1.cbuOOg.StyledPriceTypo-jah2p3-7.cGTwsk")?.textContent ?? 0, product);
        price[1] = await page.evaluate((el) => el.querySelector("div > span.ScreenreaderTextSpan-sc-11hj9ix-0.dbaUJY")?.outerText ?? 0, product);
        //pri = price[0] + "";
        //price[0] = pri.replace('–', '0');
        price = price[0] + " " + price[1];
        //let price = await page.evaluate((el) => el.querySelector("div > span.ScreenreaderTextSpan-sc-11hj9ix-0.dbaUJY")?.outerText, product) + "";
        /*price = price.replace(/[^\w\s]/gi, '');
        if (price == '0') {
            price = await page.evaluate((el) => el.querySelector(".dbaUJY")?.outerText ?? 0, product) + "";
            price = price.replace(/[^\w\s]/gi, '');
        }*/
        //availability
        const availability = await page.evaluate((el) => el.querySelector('[data-test="mms-delivery-online-availability_AVAILABLE"] > div')?.outerText ?? "", product);
        //delivery
        const delivery_time = await page.evaluate((el) => el.querySelector('.ghLrFT')?.outerText ?? "", product);

        const product_tmp = {
            category,
            name,
            url: "https://www.mediamarkt.es" + url,
            image_url,
            brand,
            specifications: specificationsArray,
            delivery_time,
            price,
            availability,
            brand
        };
        //pushing the product into list of products
        products_list.push(product_tmp);
        //products_list.forEach((product) => console.log(product))

    }

    await savingData(products_list);
    await browser.close();
};

const scrapUrls = async () => {
    try {
        const urls = [
            //"https://www.mediamarkt.es/es/category/port%C3%A1tiles-de-14-a-16-9-156.html",
            "https://www.mediamarkt.es/es/category/ordenadores-162.html",
            "https://www.mediamarkt.es/es/category/_port%C3%A1tiles-gaming-701410.html",
            "https://www.mediamarkt.es/es/category/ssd-198.html"
        ]
        await clearCollections()
        for (let url of urls) {
            let data = await scrap(url);
        }
        console.log("All pages are finished");
        await mongoose.connection.close();
    } catch (error) {
        console.log("scrapUrls : " + error);
    }
};


scrapUrls();

