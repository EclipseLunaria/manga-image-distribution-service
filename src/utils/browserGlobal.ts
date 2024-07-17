import puppeteer from "puppeteer";
import { Browser } from "puppeteer";

let browser: Browser | null = null;

const getBrowser = async () => {
    if (browser === null) {
        browser = await puppeteer.launch({args: ["--no-sandbox", "--disable-setuid-sandbox"]});
    }
    return browser;
};


const closeBrowser = async () => {
    if (browser !== null) {
        await browser.close();
        browser = null;
    }
};


export { getBrowser, closeBrowser };