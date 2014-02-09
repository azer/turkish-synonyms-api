var debug = require("debug")('turkish-synonyms-api');
var circle = require("circle");
var scrape = require("scrape-url");
var memoize = require('memoize-with-leveldb')('./data-synonyms');
var query = memoize(pull, -1); // never invalidates
var url = 'http://tdk.org.tr/index.php?option=com_esanlamlar&arama=esanlam';

module.exports = circle({
  '/:word': synonym
});

function synonym (reply, match) {
  query(match.params.word, reply);
}

function pull (word, callback) {
  scrape.post({ url: url, form: { keyword: word } }, '.meaning', function (error, match) {
    if (match.length == 0 || !match[0].html()) return callback(undefined, []);
    callback(undefined, match[0].html().split(/\s*\/\s*/));
  });
}
