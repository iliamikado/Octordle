import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const selectWords = ((state: RootState) => state.game.words);
export const selectWord = ((state: RootState, payload: number) => state.game.words[payload]);
export const selectTries = ((state: RootState) => state.game.tries);
export const selectTriesCount = ((state: RootState) => state.game.triesCount);
export const selectCurrentInput = ((state: RootState) => state.game.currentInput);
export const selectIsGameStarted = ((state: RootState) => (state.game.tries[0]));
export const selectIsGameEnd = ((state: RootState) => (state.game.tries.length === state.game.triesCount || state.game.words.every((word) => (state.game.tries.indexOf(word) !== -1))));
export const selectDay = ((state: RootState) => state.game.day);
export const selectChosenInput = ((state: RootState) => state.game.chosenInput);
export const selectChosenLetter = ((state: RootState) => state.game.chosenLetter);
export const selectKeyboardMask = createSelector([selectTries, selectWords, selectChosenInput], (tries, words, chosenInput) => {
    const keyMask = {} as any;
    tries.forEach(tryWord => {
        for (let c of tryWord) {
            keyMask[c] = (new Array(words.length)).fill('notExist')
        }
    })
    if (chosenInput !== null) {
        let word = words[chosenInput];
        tries.forEach(tryWord => {
            for (let j = 0; j < tryWord.length; ++j) {
                if (tryWord[j] === word[j]) {
                    keyMask[tryWord[j]] = ['rightPlace', 'rightPlace'];
                } else if (word.includes(tryWord[j]) && keyMask[tryWord[j]][0] !== 'rightPlace') {
                    keyMask[tryWord[j]] = ['wrongPlace', 'wrongPlace'];
                }
            }
        })
        return keyMask;
    }
    for (let i = 0; i < words.length; ++i) {
        let word = words[i];
        if (tries.includes(word)) {
            continue;
        }
        tries.forEach(tryWord => {
            for (let j = 0; j < tryWord.length; ++j) {
                if (tryWord[j] === word[j]) {
                    keyMask[tryWord[j]][i] = 'rightPlace';
                } else if (word.includes(tryWord[j]) && keyMask[tryWord[j]][i] !== 'rightPlace') {
                    keyMask[tryWord[j]][i] = 'wrongPlace';
                }
            }
        })
    }
    return keyMask;
})
export const selectWordsMask = createSelector([selectTries, selectWords], (tries, words) => {
    return words.map(word => (tries.includes(word)));
})
export const selectChangeDeleteAndEnter = (state: RootState) => (state.settings.changeDeleteAndEnter);
export const selectDarkTheme = (state: RootState) => (state.settings.darkTheme);
export const selectHighlightHardWords = (state: RootState) => (state.settings.highlightHardWords);
export const selectUuid = (state: RootState) => (state.settings.uuid);
export const selectUserInfo = (state: RootState) => (state.settings.userInfo);
export const selectNews = (state: RootState) => (state.settings.newsList);

