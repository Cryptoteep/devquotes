// Search the corpus and render the top hits as compact lines.
import { searchQuotes, renderQuoteHighlight } from '../src/index.js';

const results = searchQuotes({ query: 'naming cache', limit: 3 });

console.log(`Found ${results.length} matching quotes:\n`);
for (const { quote, score } of results) {
  console.log(`[score ${score}]`);
  console.log(renderQuoteHighlight(quote));
  console.log('');
}
