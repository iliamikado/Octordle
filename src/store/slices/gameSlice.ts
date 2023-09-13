import { isWordValid } from '@/wordsLogic/helpers';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  words: [''] as string[],
  tries: [] as string[],
  day: 0,
  keyboardMask: {} as any,
  currentInput: '',
  triesCount: 12
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setWords: (state, action: PayloadAction<string[]>) => {
      state.words = action.payload;
    },
    setDay: (state, action: PayloadAction<number>) => {
      state.day = action.payload;
    },
    addLetterToCurrentInput: (state, action: PayloadAction<string>) => {
      if (state.currentInput.length < state.words[0].length) {
        state.currentInput += action.payload;
      }
    },
    removeLetterFromCurrentInput: (state) => {
      if (state.currentInput.length > 0) {
        state.currentInput = state.currentInput.slice(0, state.currentInput.length - 1);
      }
    },
    addCurrentInputToTries: (state) => {
      if (state.tries.length < state.triesCount && isWordValid(state.currentInput)) {
        const word = state.currentInput;
        state.tries.push(word);
        state.currentInput = '';

        for (let i = 0; i < state.words.length; ++i) {
          const rightWord = state.words[i];
          for (let j = 0; j < word.length; ++j) {
            if (!state.keyboardMask[word[j]]) {
              state.keyboardMask[word[j]] = [];
            }
            if (state.keyboardMask[word[j]][i] === 'rightPlace') {
              continue;
            }
            if (word[j] === rightWord[j]) {
              state.keyboardMask[word[j]][i] = 'rightPlace';
            } else if (rightWord.indexOf(word[j]) !== -1) {
              state.keyboardMask[word[j]][i] = 'wrongPlace';
            } else {
              state.keyboardMask[word[j]][i] = 'notExist';
            }
          }
        }
      }
    }
  },
})

export const { setWords, setDay, addLetterToCurrentInput, removeLetterFromCurrentInput, addCurrentInputToTries } = gameSlice.actions

export default gameSlice.reducer