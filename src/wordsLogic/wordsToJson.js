const fs = require('fs');
const words = fs.readFileSync('src/wordsLogic/words.txt').toString().split('\n').map(x => (x.trim().split(',')));
words.sort()
console.log(words);
const easyWords = words.filter(x => (x[1] === '1')).map(x => (x[0]));
const hardWords = words.filter(x => (x[1] === '2')).map(x => (x[0]));
fs.writeFileSync('src/wordsLogic/words.json', JSON.stringify({easyWords, hardWords}));