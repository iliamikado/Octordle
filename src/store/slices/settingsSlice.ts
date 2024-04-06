import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface News {
  id: number,
  text: string,
  date: string
}

const initialState = {
    darkTheme: true,
    changeDeleteAndEnter: false,
    highlightHardWords: false,
    uuid: '',
    userInfo: null as any,
    newsList: [] as News[],
    dayNews: null as (News | null)
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
    toggleHighlightHardWords: (state) => {
      state.highlightHardWords = !state.highlightHardWords;
    },
    setSettings: (state, action: PayloadAction<{darkTheme: boolean, changeDeleteAndEnter: boolean, highlightHardWords: boolean}>) => {
      state.darkTheme = action.payload.darkTheme;
      state.changeDeleteAndEnter = action.payload.changeDeleteAndEnter;
      state.highlightHardWords = action.payload.highlightHardWords;
    },
    setUuid: (state, action: PayloadAction<string>) => {
      state.uuid = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },
    setNews: (state, action: PayloadAction<News[]>) => {
      state.newsList = action.payload
    },
    setDayNews: (state, action: PayloadAction<News | null>) => {
      state.dayNews = action.payload
    },
  },
})

export const { toggleChangeDeleteAndEnter, toggleDarkTheme, toggleHighlightHardWords, setSettings, setUuid, setUserInfo, setNews, setDayNews } = settingsSlice.actions

export default settingsSlice.reducer