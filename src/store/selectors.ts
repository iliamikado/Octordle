import { RootState } from "./store";

export const selectWords = ((state: RootState) => state.game.words);
export const selectWord = ((state: RootState, payload: number) => state.game.words[payload]);
export const selectTries = ((state: RootState) => state.game.tries);
export const selectTriesCount = ((state: RootState) => state.game.triesCount);
export const selectCurrentInput = ((state: RootState) => state.game.currentInput);
export const selectKeyboardMask = ((state: RootState) => state.game.keyboardMask);
export const selectIsGameEnd = ((state: RootState) => (state.game.tries.length === state.game.triesCount || state.game.words.every((word) => (state.game.tries.indexOf(word) !== -1))));
export const selectDay = ((state: RootState) => state.game.day);

