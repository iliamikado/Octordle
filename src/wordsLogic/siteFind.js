const fs = require('fs');
const path = 'src/wordsLogic/';

async function write() {
    const newWords = [];

    for (let i = 1; i <= 42; ++i) {
        await fetch('https://bezbukv.ru/mask/*****/noun?page=' + i).then(data => {
            return data.text()
        }).then(text => {
            const words = text.match(/\.\n\t.....\t<br \/>/g).map(x => x.slice(3, 8));
            newWords.push(...words);
        })
    }

    console.log(newWords);
    fs.writeFileSync(path + 'newWords.txt', newWords.join('\n'));
}

function reallyNewWords() {
    const oldWords = fs.readFileSync(path + 'words.txt').toString().split('\r\n').map(x => (x.split(',')[0]));
    const newWords = fs.readFileSync(path + 'newWords.txt').toString().split('\n');
    const set = new Set(oldWords);
    const ans = [];
    newWords.forEach(word => {
        if (!set.has(word)) {
            ans.push(word);
        }
    })
    fs.writeFileSync(path + 'reallyNewWords.txt', ans.join('\n'));
}

function makeWords() {
    const oldWords = fs.readFileSync(path + 'words.txt').toString().split('\r\n').map(x => (x.split(',')));
    const newWords = fs.readFileSync(path + 'reallyNewWords.txt').toString().split('\n').map(x => ([x, '2']));
    const ans = oldWords.concat(newWords).map(x => (x[0] + ',' + x[1]));
    fs.writeFileSync(path + 'words.txt', ans.join('\n'));
}


// write();
// reallyNewWords();
makeWords();