import vocab from './words.json';
const words = vocab.words;
const wordsSet = new Set(words);

export function isWordValid(word: string) {
    return wordsSet.has(word);
}

export function getRandomWords(seed: number, count: number) {
    const ans = [];
    for (let i = 0; i < count; ++i) {
        seed = seed * 16807 % 2147483647;
        ans.push(words[seed % words.length]);
    }
    return ans;
}

export function isRussianLetter(s: string) {
    const code = s.charCodeAt(0);
    return 'а'.charCodeAt(0) <= code && 'я'.charCodeAt(0) >= code;
}
