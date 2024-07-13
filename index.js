const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://hidoristream.com';

module.exports = async (req, res) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    let links = [];
    $('a').each((index, element) => {
      const link = $(element).attr('href');
      if (link && (link.includes('gdrive') || link.includes('terabox'))) {
        links.push(link);
      }
    });

    res.status(200).json({ links: links });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the webpage' });
  }
};
