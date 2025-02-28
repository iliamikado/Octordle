import vocab from './words.json';
const {easyWords, hardWords} = vocab;
const words = easyWords.concat(hardWords);
const wordsSet = new Set(words);
const hardWordsSet = new Set(hardWords);

export function isWordValid(word: string) {
    return wordsSet.has(word);
}

export function isWordHard(word: string) {
    return hardWordsSet.has(word);
}

export function getRandomWords(seed: number, count: number, mode?: string) {
    const ans = [];
    for (let i = 0; i < count; ++i) {
        seed = seed * 16807 % 2147483647;
        if (mode === 'sogra') {
            ans.push(words[seed % words.length]);
        } else {
            ans.push(easyWords[seed % easyWords.length]);
        }
    }
    return ans;
}

export function isRussianLetter(s: string) {
    const code = s.charCodeAt(0);
    return 'а'.charCodeAt(0) <= code && 'я'.charCodeAt(0) >= code;
}
