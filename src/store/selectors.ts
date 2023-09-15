import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const selectWords = ((state: RootState) => state.game.words);
export const selectWord = ((state: RootState, payload: number) => state.game.words[payload]);
export const selectTries = ((state: RootState) => state.game.tries);
export const selectTriesCount = ((state: RootState) => state.game.triesCount);
export const selectCurrentInput = ((state: RootState) => state.game.currentInput);
export const selectIsGameEnd = ((state: RootState) => (state.game.tries.length === state.game.triesCount || state.game.words.every((word) => (state.game.tries.indexOf(word) !== -1))));
export const selectDay = ((state: RootState) => state.game.day);
export const selectKeyboardMask = createSelector([selectTries, selectWords], (tries, words) => {
    const keyMask = {} as any;
    tries.forEach(tryWord => {
        for (let c of tryWord) {
            keyMask[c] = (new Array(words.length)).fill('notExist')
        }
    })
    for (let i = 0; i < words.length; ++i) {
        let word = words[i];
        if (tries.includes(word)) {
            continue;
        }
        tries.forEach(tryWord => {
            for (let j = 0; j < tryWord.length; ++j) {
                if (tryWord[j] === word[j]) {
                    keyMask[tryWord[j]][i] = 'rightPlace';
                } else if (word.includes(tryWord[j])) {
                    keyMask[tryWord[j]][i] = 'wrongPlace';
                }
            }
        })
    }
    return keyMask;
})

