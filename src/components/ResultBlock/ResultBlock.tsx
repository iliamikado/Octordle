import { selectDay, selectTries, selectWords } from "@/store/selectors"
import { useAppSelector } from "@/store/store"

import styles from './ResultBlock.module.scss';
import { useCallback } from "react";

const digits = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'];

export const ResultBlock = () => {
    const words = useAppSelector(selectWords);
    const tries = useAppSelector(selectTries);
    const day = useAppSelector(selectDay);
    const res = words.map(word => (digits[tries.indexOf(word)] || '🟥'));

    const copyRes = useCallback(() => {
        let textRes = `Дневной Осьминогль #${day}:`;
        for (let i = 0; i < res.length; ++i) {
            if (i % 2 === 0) {
                textRes += '\n';
            }
            textRes += res[i] + ' ';
        }
        navigator.clipboard.writeText(textRes);
    }, [res, day])

    return <div className={styles.resultBlock}>
        <div className={styles.resultText}>
            <div className={styles.smiles}>
                {res.map((c, i) => <span key={i}>{c}</span>)}
            </div>
            <div className={styles.answers}>
                {words.map((word, i) => <span key={i}>{word}</span>)}
            </div>
        </div>
        <button className={styles.copyButton} onClick={copyRes}>копировать результат</button>
    </div>
}