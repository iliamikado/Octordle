const fs = require('fs');
const words = fs.readFileSync('src/wordsLogic/words.txt').toString().split('\r\n').map(x => (x.split(',')));
words.sort()
const easyWords = words.filter(x => (x[1] === '1')).map(x => (x[0]));
const hardWords = words.filter(x => (x[1] === '2')).map(x => (x[0]));
fs.writeFileSync('src/wordsLogic/words.json', JSON.stringify({easyWords, hardWords}));