/**
 * Rough port of the Python understat module to Node.js.
 * It focuses on providing a getStats/getData function that fetches and decodes JSON data embedded in pages.
 *
 * Note: The original Python used regex + codecs.escape_decode to extract JSON from scripts.
 * This implementation attempts similar behavior using regex and decodeURIComponent when necessary.
 */

const fetch = require('node-fetch');
const { BASE_URL } = require('./constants');

async function getData(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'node-fetch' } });
  if (!res.ok) throw new Error('Failed to fetch ' + url + ' - ' + res.status);
  const text = await res.text();

  // attempt to find JSON in scripts like: var some = JSON.parse('...');
  const regex = /JSON\.parse\('(.*)'\)/s;
  let match = regex.exec(text);
  if (match) {
    // the JSON is escaped inside single quotes; unescape
    const escaped = match[1];
    try {
      const unescaped = escaped.replace(/\\u0026/g, '&'); // small normalization
      const decoded = unescapeString(unescaped);
      return JSON.parse(decoded);
    } catch (e) {
      // fallback: try to find plain JSON object
    }
  }

  // fallback: try to parse a direct JSON in a script tag
  const rawJsonRegex = /<script[^>]*>\s*window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]*?\})\s*;<\/script>/;
  match = rawJsonRegex.exec(text);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      // ignore parse error
    }
  }

  throw new Error('Could not extract JSON data from ' + url);
}

function unescapeString(s) {
  // replace common escape sequences used by understat
  // this is a best-effort conversion
  return s.replace(/\\\'/g, "'").replace(/\\n/g, '').replace(/\\r/g, '');
}

async function getStats(options) {
  // Example: fetch league page and extract data.
  // If you need specific endpoints, adapt this function.
  const league = (options && options.league) ? options.league : '';
  const url = BASE_URL + league;
  const data = await getData(url);
  return data;
}

module.exports = {
  getData,
  getStats
};
