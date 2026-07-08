// Basic usage: pick a random quote and print it to the console.
import { getRandomQuote, renderQuoteCard } from '../src/index.js';

const quote = getRandomQuote();
if (quote) {
  console.log(renderQuoteCard(quote));
} else {
  console.log('No quotes available.');
}
