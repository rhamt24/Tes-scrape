const puppeteer = require('puppeteer');

const url = 'https://hidoristream.com';

module.exports = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const html = await page.content();
    const $ = require('cheerio').load(html);

    let links = [];
    $('a').each((index, element) => {
      const link = $(element).attr('href');
      if (link && (link.includes('gdrive') || link.includes('terabox'))) {
        links.push(link);
      }
    });

    await browser.close();
    res.status(200).json({ links: links });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve the webpage' });
  }
};
