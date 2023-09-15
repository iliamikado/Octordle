import { isWordValid } from '@/wordsLogic/helpers';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  words: [''] as string[],
  tries: [] as string[],
  day: 0,
  currentInput: '',
  triesCount: 14
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setWords: (state, action: PayloadAction<string[]>) => {
      state.words = action.payload;
    },
    setDay: (state, action: PayloadAction<number>) => {
      localStorage.setItem('day', action.payload.toString());
      state.day = action.payload;
    },
    setTries: (state, action: PayloadAction<string[]>) => {
      state.tries = action.payload;
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
        localStorage.setItem('tries', state.tries.join(' '));
        state.currentInput = '';
      }
    }
  },
})

export const { setWords, setDay, setTries, addLetterToCurrentInput, removeLetterFromCurrentInput, addCurrentInputToTries } = gameSlice.actions

export default gameSlice.reducer