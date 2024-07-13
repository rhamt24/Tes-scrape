const puppeteer = require('puppeteer');

const url = 'https://hidoristream.com';

module.exports = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const html = await page.content();
    const $ = require('cheerio').load(html);

    console.log(html); // Menampilkan HTML yang diambil untuk debugging

    let links = [];
    $('a').each((index, element) => {
      const link = $(element).attr('href');
      console.log(link); // Menampilkan setiap tautan yang ditemukan untuk debugging
      if (link && (link.includes('gdrive') || link.includes('terabox'))) {
        links.push(link);
      }
    });

    await browser.close();
    res.status(200).json({ links: links });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the webpage' });
  }
};
