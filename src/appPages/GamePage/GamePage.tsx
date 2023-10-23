'use client'

import { WordsInput } from "@/components/WordsInput/WordsInput";
import { selectIsGameEnd, selectWords } from "@/store/selectors";
import { addCurrentInputToTries, addLetterToCurrentInput, moveChosenLetter, removeLetterFromCurrentInput, setDay, setTries, setWords } from "@/store/slices/gameSlice";
import { getRandomWords, isRussianLetter } from "@/wordsLogic/helpers";
import { useCallback, useEffect } from "react"

import styles from './GamePage.module.scss';
import { Keyboard } from "@/components/Keyboard/Keyboard";
import { Header } from "@/components/Header/Header";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ResultBlock } from "@/components/ResultBlock/ResultBlock";

const START_DAY = 19612;

export const GamePage = () => {
    const dispatch = useAppDispatch();
    const words = useAppSelector(selectWords);
    const isGameEnd = useAppSelector(selectIsGameEnd);

    useEffect(() => {
        const day = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - START_DAY;
        const savedDay = localStorage.getItem('day');
        if (Number(savedDay) === day) {
            const tries = localStorage.getItem('tries')?.split(' ');
            if (tries) {
                dispatch(setTries(tries))
            }
        } else {
            localStorage.removeItem('day');
            localStorage.removeItem('tries');
            localStorage.setItem('resultSended', 'false');
        }
        dispatch(setDay(day));
        dispatch(setWords(getRandomWords(day, 8, 'easy')));
    }, [dispatch]);

    const keyListener = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Backspace') {
            dispatch(removeLetterFromCurrentInput());
        }
        if (e.code === 'Enter') {
            dispatch(addCurrentInputToTries());
        }
        if (e.code === 'ArrowRight') {
            dispatch(moveChosenLetter(1));
        }
        if (e.code === 'ArrowLeft') {
            dispatch(moveChosenLetter(-1));
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

    useEffect(() => {
        document.getElementById('scrollContainer')?.scrollTo({top: 0});
    }, [isGameEnd]);

    return <main className={styles.page}>
        <div className={styles.scrollContainer} id={'scrollContainer'}>
            <Header/>
            {isGameEnd ? <ResultBlock/> : null}
            <div className={styles.inputsContainer}>
                {words.map((word, i) => (<WordsInput key={i} wordInd={i}/>))}
            </div>
        </div>
        {isGameEnd ? null : <Keyboard/>}
    </main>
}