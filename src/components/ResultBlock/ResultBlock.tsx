import { selectDay, selectTries, selectUuid, selectWords } from "@/store/selectors"
import { useAppSelector } from "@/store/store"

import styles from './ResultBlock.module.scss';
import { useCallback, useEffect, useState } from "react";
import { getGameStat, postGameResult } from "@/service/service";

const digits = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🕚', '🕛', '🕐', '🕑', '🕒'];

export const ResultBlock = () => {
    const words = useAppSelector(selectWords);
    const tries = useAppSelector(selectTries);
    const day = useAppSelector(selectDay);
    const uuid = useAppSelector(selectUuid);
    const [betterThan, setBetterThan] = useState(-1);
    const [copied, setCopied] = useState(false);

    const res = words.map(word => (digits[tries.indexOf(word)] || '🟥'));
    const [attempts] = useState(words.map(word => (tries.indexOf(word))).map(x => x + 1));
    const [scoreForWord] = useState(attempts.map(x => (x === 0 ? 0 : (20 - x))));
    const [score] = useState(scoreForWord.reduce((sc, x) => (sc + x), 0));

    let smile: string;

    if (attempts.includes(1)) {
        smile = '😑'
    } else if (attempts.every(x => (x <= 10 && x !== 0))) {
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
        let textRes = `octordle▪️ru #${day}:`;
        for (let i = 0; i < res.length; ++i) {
            if (i % 2 === 0) {
                textRes += '\n';
            }
            textRes += res[i] + ' ';
        }
        textRes += `\nСчет: ${score} ${smile}`;
        if (betterThan !== -1) {
            textRes += `\nКруче ${betterThan}% игроков`;
        }
        navigator.clipboard.writeText(textRes);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }, [res, day, score, smile, betterThan]);

    useEffect(() => {
        const resultSended = localStorage.getItem('resultSended') === 'true';
        if (!resultSended) {
            postGameResult({day, words: tries.join(' '), tries: attempts.join(' '), score, uuid}).then(res => {
                localStorage.setItem('resultSended', 'true');
                setBetterThan(res.betterThan)
            }).catch(e => {});
        } else {
            getGameStat({day, words: tries.join(' '), tries: attempts.join(' '), score, uuid}).then(res => {
                setBetterThan(res.betterThan)
            }).catch(e => {});
        }
    }, [day, tries, attempts, score, uuid]);

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
        {betterThan === -1 ? null : <div className={styles.betterThan}>
            Ваш результат лучше, чем у {betterThan}% игроков
        </div>}
        <button className={styles.copyButton} onClick={copyRes} disabled={copied}>{copied ? 'скопировано' : 'копировать результат'}</button>
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