// Quote-of-the-day banner, exported as markdown — handy for team MOTDs.
import { getQuoteOfTheDay, exportQuotes } from '../src/index.js';

const qotd = getQuoteOfTheDay();
if (!qotd) {
  console.error('No quote of the day available.');
  process.exit(1);
}

console.log(exportQuotes([qotd], 'markdown'));
