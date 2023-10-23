import { selectDay, selectTries, selectTriesCount, selectWords } from "@/store/selectors"
import { useAppSelector } from "@/store/store"

import styles from './ResultBlock.module.scss';
import { useCallback, useEffect, useState } from "react";
import { postGameResult } from "@/service/service";

const digits = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🕚', '🕛', '🕐', '🕑', '🕒'];

export const ResultBlock = () => {
    const words = useAppSelector(selectWords);
    const tries = useAppSelector(selectTries);
    const day = useAppSelector(selectDay);

    const res = words.map(word => (digits[tries.indexOf(word)] || '🟥'));
    const attempts = words.map(word => (tries.indexOf(word))).map(x => x + 1);
    const scoreForWord = attempts.map(x => (x === 0 ? 0 : (20 - x)));
    const score = scoreForWord.reduce((sc, x) => (sc + x), 0);

    let smile: string;

    if (attempts.includes(1)) {
        smile = '😑'
    } else if (attempts.every(x => (x <= 10))) {
        smile = '🤯'
    } else if (score >= 90) {
        smile = '😎'
    } else if (score >= 70) {
        smile = '😊'
    } else if (score >= 50) {
        smile = '🙂'
    } else {
        smile = '😶'
    }

    const copyRes = useCallback(() => {
        let textRes = `Дневной Осьминогль #${day}:`;
        for (let i = 0; i < res.length; ++i) {
            if (i % 2 === 0) {
                textRes += '\n';
            }
            textRes += res[i] + ' ';
        }
        textRes += `\nСчет: ${score} ${smile}`;
        navigator.clipboard.writeText(textRes);
    }, [res, day, score, smile]);

    useEffect(() => {
        const resultSended = localStorage.getItem('resultSended') === 'true';
        if (!resultSended) {
            localStorage.setItem('resultSended', 'true');
            postGameResult({day, words: words.join(' '), tries: attempts.join(' '), score});
        }
    }, [day, words, attempts, score]);

    return <div className={styles.resultBlock}>
        <div className={styles.resultText}>
            <div className={styles.smiles}>
                {res.map((c, i) => <span key={i}>{c}</span>)}
            </div>
            <div className={styles.answers}>
                {words.map((word, i) => <span key={i}>{word}</span>)}
            </div>
        </div>
        <span>Счет: {scoreForWord.join('+')} = {score} {smile}</span>
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