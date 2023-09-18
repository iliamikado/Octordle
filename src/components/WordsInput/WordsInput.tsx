import { selectChosenInput, selectCurrentInput, selectTries, selectTriesCount, selectWord } from "@/store/selectors";
import cn from 'classnames';

import styles from './WordsInput.module.scss';
import { useAppDispatch, useAppSelector } from "@/store/store";
import { isWordValid } from "@/wordsLogic/helpers";
import { setChosenInput } from "@/store/slices/gameSlice";

interface Props {
    wordInd: number;
}

export const WordsInput = ({wordInd}: Props) => {
    const dispatch = useAppDispatch();
    const tries = useAppSelector(selectTries);
    const triesCount = useAppSelector(selectTriesCount);
    const rightWord = useAppSelector((state) => selectWord(state, wordInd));
    const isChosen = useAppSelector(selectChosenInput) === wordInd;

    if (!rightWord) {
        return null;
    }

    let isWin = false;
    const rows = [];
    for (let i = 0; i < tries.length; ++i) {
        rows.push(
            <div key={i} className={styles.row}>
                {getMask(rightWord, tries[i]).map((st, j) => (
                    <div key={j} className={cn(styles.charCell, styles[st])}>
                        {tries[i][j]}
                    </div>
                ))}
            </div>
        );
        if (tries[i] === rightWord) {
            isWin = true;
            break;
        }
    }
    if (!isWin && tries.length < triesCount) {
        rows.push(<CurrentInput key={'currentInput'} length={rightWord.length}/>);
    }
    for (let i = rows.length; i < triesCount; ++i) {
        rows.push(
            <div key={i} className={styles.row}>
                {rightWord.split('').map((_, j) => (<div key={j} className={styles.charCell}></div>))}
            </div>
        )
    }   

    return <div 
        className={cn(styles.container, isChosen ? styles.chosen : '')}
        onClick={() => {dispatch(setChosenInput(isChosen ? null : wordInd))}}>
            {rows}
    </div>
}

const CurrentInput = ({length}: {length: number}) => {
    const word = useAppSelector(selectCurrentInput);
    const invalidWord = (word.length === length && !isWordValid(word));

    const row = [];
    for (let i = 0; i < length; ++i) {
        row.push(<div
            className={cn(styles.charCell, styles.inputCharCell, (invalidWord ? styles.invalidWordCell : ''))}
            key={i}>{word[i] ?? ''}
        </div>)
    }

    return <div className={styles.row}>
        {row}
    </div>
}

function getMask(rightWord: string, tryWord: string) {
    const lettersCount = new Map<string, number>();
    rightWord.split('').forEach(c => {
        lettersCount.set(c, (lettersCount.get(c) ?? 0) + 1);
    })
    const mask = new Array(rightWord.length);
    for (let i = 0; i < rightWord.length; ++i) {
        if (rightWord[i] === tryWord[i]) {
            mask[i] = 'rightPlace';
            lettersCount.set(rightWord[i], (lettersCount.get(rightWord[i]) ?? 0) - 1)
        }
    }
    for (let i = 0; i < rightWord.length; ++i) {
        if (mask[i] === 'rightPlace') {
            continue
        }
        if (lettersCount.get(tryWord[i])) {
            lettersCount.set(tryWord[i], (lettersCount.get(tryWord[i]) ?? 0) - 1);
            mask[i] = 'wrongPlace';
        } else {
            mask[i] = 'notExist';
        }
    }
    return mask;
}