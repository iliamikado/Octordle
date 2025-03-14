import { isWordValid } from '@/wordsLogic/helpers';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  words: [''] as string[],
  tries: [] as string[],
  day: 0,
  currentInput: [] as string[],
  triesCount: 14,
  chosenInput: null as (null | number),
  chosenLetter: 0,
  resultSended: false
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setWords: (state, action: PayloadAction<string[]>) => {
      state.words = action.payload;
      state.currentInput = (new Array(state.words[0].length)).fill('');
    },
    setDay: (state, action: PayloadAction<number>) => {
      localStorage.setItem('day', action.payload.toString());
      state.day = action.payload;
    },
    setTries: (state, action: PayloadAction<string[]>) => {
      state.tries = action.payload;
    },
    setChosenInput: (state, action: PayloadAction<number | null>) => {
      state.chosenInput = action.payload;
    },
    setChosenLetter: (state, action: PayloadAction<number>) => {
      state.chosenLetter = action.payload;
    },
    moveChosenLetter: (state, action: PayloadAction<number>) => {
      let newInd = state.chosenLetter + action.payload;
      if (newInd >= 0 && newInd < state.words[0].length) {
        state.chosenLetter = newInd;
      }
    },
    addLetterToCurrentInput: (state, action: PayloadAction<string>) => {
      state.currentInput[state.chosenLetter] = action.payload;
      if (state.chosenLetter < state.words[0].length - 1) {
        state.chosenLetter++;
      }
    },
    removeLetterFromCurrentInput: (state) => {
      const ind = state.chosenLetter;
      if (state.currentInput[ind]) {
        state.currentInput[ind] = '';
      } else if (ind > 0) {
        state.chosenLetter -= 1;
        state.currentInput[ind - 1] = '';
      }
    },
    addCurrentInputToTries: (state, action: PayloadAction<('sogra' | '')>) => {
      if (state.tries.length < state.triesCount && state.currentInput.every(x => (x)) && isWordValid(state.currentInput.join(''))) {
        const word = state.currentInput.join('');
        state.tries.push(word);
        localStorage.setItem(action.payload === 'sogra' ? 'triesSogra' : 'tries', state.tries.join(' '));
        state.currentInput = (new Array(state.words[0].length)).fill('');
        state.chosenLetter = 0;
      }
    },
    setResultSended: (state, action: PayloadAction<boolean>) => {
      state.resultSended = action.payload
    }
  },
})

export const { setWords, setDay, setTries, setChosenInput, moveChosenLetter, setChosenLetter, addLetterToCurrentInput, removeLetterFromCurrentInput, addCurrentInputToTries, setResultSended } = gameSlice.actions

export default gameSlice.reducer