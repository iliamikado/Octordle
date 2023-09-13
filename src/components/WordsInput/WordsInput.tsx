import { selectCurrentInput, selectTries, selectTriesCount, selectWord } from "@/store/selectors";
import cn from 'classnames';

import styles from './WordsInput.module.scss';
import { useAppSelector } from "@/store/store";
import { isWordValid } from "@/wordsLogic/helpers";

interface Props {
    wordInd: number;
}

export const WordsInput = ({wordInd}: Props) => {
    const tries = useAppSelector(selectTries);
    const triesCount = useAppSelector(selectTriesCount);
    const rightWord = useAppSelector((state) => selectWord(state, wordInd));

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

    return <div className={styles.container}>
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
    return tryWord.split('').map((c, i) => {
        if (c === rightWord[i]) {
            return 'rightPlace';
        } else if (rightWord.indexOf(c) !== -1) {
            return 'wrongPlace';
        } else {
            return 'notExist';
        }
    })
}