'use client'

import { WordsInput } from "@/components/WordsInput/WordsInput";
import { selectDay, selectIsGameEnd, selectIsGameStarted, selectUuid, selectWords } from "@/store/selectors";
import { addCurrentInputToTries, addLetterToCurrentInput, moveChosenLetter, removeLetterFromCurrentInput, setDay, setTries, setWords } from "@/store/slices/gameSlice";
import { getRandomWords, isRussianLetter } from "@/wordsLogic/helpers";
import { useCallback, useEffect } from "react"

import styles from './GamePage.module.scss';
import { Keyboard } from "@/components/Keyboard/Keyboard";
import { Header } from "@/components/Header/Header";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ResultBlock } from "@/components/ResultBlock/ResultBlock";
import { postStart } from "@/service/service";
import { useSearchParams } from "next/navigation";

const START_DAY = 19612;

export const GamePage = () => {
    const dispatch = useAppDispatch();
    const words = useAppSelector(selectWords);
    const isGameEnd = useAppSelector(selectIsGameEnd);
    const isGameStarted = useAppSelector(selectIsGameStarted);
    const day = useAppSelector(selectDay);
    const uuid = useAppSelector(selectUuid);
    const searchParams = useSearchParams();
    const mode: ('sogra' | '') = searchParams.get("mode") === 'sogra' ? 'sogra' : '';

    useEffect(() => {
        const day = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - START_DAY;
        const words = getRandomWords(day, 8, mode);
        const savedDay = localStorage.getItem('day');
        const wordsHash = localStorage.getItem('wordsHash');
        const wordsHashSogra = localStorage.getItem('wordsHashSogra');
        if (mode === '' && wordsHash && +wordsHash !== cyrb53(words.join(''))) {
            localStorage.removeItem('tries');
            localStorage.setItem('resultSended', 'false');
            localStorage.setItem('startSended', 'false');
        }

        if (mode === 'sogra' && wordsHashSogra && +wordsHashSogra !== cyrb53(words.join(''))) {
            localStorage.removeItem('triesSogra');
            localStorage.setItem('resultSograSended', 'false');
            localStorage.setItem('startSograSended', 'false');
        }

        if (Number(savedDay) === day) {
            const tries = localStorage.getItem(mode === 'sogra' ? 'triesSogra' : 'tries')?.split(' ');
            if (tries) {
                dispatch(setTries(tries))
            }
        } else {
            localStorage.removeItem('day');
            localStorage.removeItem('tries');
            localStorage.removeItem('triesSogra');
            localStorage.removeItem('seenNews');
            localStorage.setItem('resultSended', 'false');
            localStorage.setItem('startSended', 'false');
            localStorage.setItem('resultSograSended', 'false');
            localStorage.setItem('startSograSended', 'false');
        }
        dispatch(setDay(day));
        dispatch(setWords(words));
        const tries = localStorage.getItem(mode === 'sogra' ? 'triesSogra' : 'tries')?.split(' ');
        dispatch(setTries(tries ?? []));
        localStorage.setItem('wordsHash' + (mode === 'sogra' ? 'Sogra' : ''), `${cyrb53(words.join(''))}`);
    }, [dispatch, mode]);

    const keyListener = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Backspace') {
            dispatch(removeLetterFromCurrentInput());
        }
        if (e.code === 'Enter') {
            dispatch(addCurrentInputToTries(mode));
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
    }, [dispatch, mode]);

    useEffect(() => {
        document.addEventListener('keydown', keyListener);
        return () => {
            document.removeEventListener('keydown', keyListener);
        }
    }, [keyListener])

    useEffect(() => {
        document.getElementById('scrollContainer')?.scrollTo({top: 0});
    }, [isGameEnd]);

    useEffect(() => {
        const startSended = localStorage.getItem(mode === '' ? 'startSended' : 'startSograSended');
        if (isGameStarted && startSended !== 'true') {
            postStart({day, word: isGameStarted, uuid}).then((data) => {
                localStorage.setItem(mode === '' ? 'startSended' : 'startSograSended', 'true');
            }).catch(e => {});
        }
    }, [day, isGameStarted, uuid, mode]);

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

const cyrb53 = (str: string) => {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};