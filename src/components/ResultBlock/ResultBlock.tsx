import { selectDay, selectTries, selectTriesCount, selectWords } from "@/store/selectors"
import { useAppSelector } from "@/store/store"

import styles from './ResultBlock.module.scss';
import { useCallback, useEffect, useState } from "react";

const digits = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🕚', '🕛', '🕐', '🕑'];

export const ResultBlock = () => {
    const words = useAppSelector(selectWords);
    const tries = useAppSelector(selectTries);
    const day = useAppSelector(selectDay);
    let score = useAppSelector(selectTriesCount) * words.length;

    const res = words.map(word => (digits[tries.indexOf(word)] || '🟥'));
    words.forEach(word => {
        const tryN = tries.indexOf(word);
        score -= (tryN === -1 ? tries.length : tryN);
    })


    const copyRes = useCallback(() => {
        let textRes = `Дневной Осьминогль #${day}:`;
        for (let i = 0; i < res.length; ++i) {
            if (i % 2 === 0) {
                textRes += '\n';
            }
            textRes += res[i] + ' ';
        }
        textRes += '\nСчет: ' + score;
        textRes += '\n\n'
        textRes += 'Отгадайте слова на ' + document.location.href;
        navigator.clipboard.writeText(textRes);
    }, [res, day, score])

    return <div className={styles.resultBlock}>
        <div className={styles.resultText}>
            <div className={styles.smiles}>
                {res.map((c, i) => <span key={i}>{c}</span>)}
            </div>
            <div className={styles.answers}>
                {words.map((word, i) => <span key={i}>{word}</span>)}
            </div>
        </div>
        <span>Счет: {score}</span>
        <button className={styles.copyButton} onClick={copyRes}>копировать результат</button>
        <Timer/>
    </div>
}

const Timer = () => {
    const [time, setTime] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            const time = (Math.floor(now / 60 / 60 / 24) + 1) * 24 * 60 * 60 - now;
            setTime(time);
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [])

    const t = [];
    t[0] = Math.floor(time / 60 / 60);
    t[1] = Math.floor(time / 60) % 60;
    t[2] = time % 60;

    return <div className={styles.timer}>
        <span>Новые слова через:</span>
        <span>
            {t.map(x => (x < 10 ? `0${x}` : `${x}`)).join(':')}
        </span>
    </div>
}