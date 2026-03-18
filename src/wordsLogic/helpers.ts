import vocab from './words.json';
const {easyWords, hardWords, badWords} = vocab;
const words = easyWords.concat(hardWords);
const wordsSet = new Set([...easyWords, ...hardWords, ...badWords]);
const hardWordsSet = new Set(hardWords);
const badWordsSet = new Set(badWords);

export function isWordValid(word: string) {
    return wordsSet.has(word);
}

export function isWordNotGuess(word: string, mode: ('sogra' | '')) {
    if (mode === 'sogra') {
        return badWordsSet.has(word);
    } else {
        return hardWordsSet.has(word) || badWordsSet.has(word);
    }
}

function createRandom(seed: number) {
    let value = seed >>> 0;

    return () => {
        value += 0x6D2B79F5;
        let t = value;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

export function getRandomWords(seed: number, count: number, mode?: string) {
    const dictionary = mode === 'sogra' ? words : easyWords;
    const random = createRandom(seed);

    return Array.from({length: count}, () => {
        return dictionary[Math.floor(random() * dictionary.length)];
    });
}

export function isRussianLetter(s: string) {
    const code = s.charCodeAt(0);
    return 'а'.charCodeAt(0) <= code && 'я'.charCodeAt(0) >= code;
}
