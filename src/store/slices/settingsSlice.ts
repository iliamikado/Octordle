import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    darkTheme: true,
    changeDeleteAndEnter: false
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleChangeDeleteAndEnter: (state) => {
      state.changeDeleteAndEnter = !state.changeDeleteAndEnter;
    },
    toggleDarkTheme: (state) => {
      state.darkTheme = !state.darkTheme;
    },
    setSettings: (state, action: PayloadAction<typeof initialState>) => {
        state.darkTheme = action.payload.darkTheme;
        state.changeDeleteAndEnter = action.payload.changeDeleteAndEnter;
    }
  },
})

export const { toggleChangeDeleteAndEnter, toggleDarkTheme, setSettings } = settingsSlice.actions

export default settingsSlice.reducer