'use client'

import { WordsInput } from "@/components/WordsInput/WordsInput";
import { selectIsGameEnd, selectWords } from "@/store/selectors";
import { addCurrentInputToTries, addLetterToCurrentInput, removeLetterFromCurrentInput, setWords } from "@/store/slices/gameSlice";
import { getRandomWords, isRussianLetter } from "@/wordsLogic/helpers";
import { useCallback, useEffect } from "react"

import styles from './GamePage.module.scss';
import { Keyboard } from "@/components/Keyboard/Keyboard";
import { Header } from "@/components/Header/Header";
import { useAppDispatch, useAppSelector } from "@/store/store";

export const GamePage = () => {
    const dispatch = useAppDispatch();
    const words = useAppSelector(selectWords);
    const isGameEnd = useAppSelector(selectIsGameEnd);

    useEffect(() => {
        dispatch(setWords(getRandomWords(5, 8)));
    }, [dispatch]);

    const keyListener = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Backspace') {
            dispatch(removeLetterFromCurrentInput());
        }
        if (e.code === 'Enter') {
            dispatch(addCurrentInputToTries());
        }
        if (isRussianLetter(e.key)) {
            dispatch(addLetterToCurrentInput(e.key));
        }
    }, [dispatch]);

    useEffect(() => {
        document.addEventListener('keydown', keyListener);
        return () => {
            document.removeEventListener('keydown', keyListener);
        }
    }, [keyListener])

    return <main className={styles.page}>
        <div className={styles.scrollContainer}>
            <Header/>
            <div className={styles.inputsContainer}>
                {words.map((word, i) => (<WordsInput key={i} wordInd={i}/>))}
            </div>
        </div>
        {isGameEnd ? null : <Keyboard/>}
    </main>
}