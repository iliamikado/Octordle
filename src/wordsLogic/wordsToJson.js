const fs = require('fs');
const lines = fs.readFileSync('src/wordsLogic/words.txt').toString().split('\n');
const words = lines
    .map((line, index) => {
        const [word, difficulty] = line.trim().split(',');
        return {
            word,
            difficulty,
            lineNumber: index + 1,
        };
    })
    .filter(({ word, difficulty }) => word && difficulty);

const duplicates = new Map();

for (const entry of words) {
    if (!duplicates.has(entry.word)) {
        duplicates.set(entry.word, []);
    }

    duplicates.get(entry.word).push(entry);
}

const conflicts = [...duplicates.entries()].filter(([, entries]) => entries.length > 1);

if (conflicts.length > 0) {
    console.error('Conflict: found duplicate words in src/wordsLogic/words.txt');
    for (const [word, entries] of conflicts) {
        const details = entries
            .map(({ lineNumber, difficulty }) => `line ${lineNumber} (difficulty ${difficulty})`)
            .join(', ');
        console.error(`- ${word}: ${details}`);
    }
    process.exit(1);
}

words.sort((a, b) => a.word.localeCompare(b.word, 'ru'));
const easyWords = words.filter(({ difficulty }) => difficulty === '1').map(({ word }) => word);
const hardWords = words.filter(({ difficulty }) => difficulty === '2').map(({ word }) => word);
const badWords = words.filter(({ difficulty }) => difficulty === '3').map(({ word }) => word);
fs.writeFileSync('src/wordsLogic/words.json', JSON.stringify({easyWords, hardWords, badWords}));
