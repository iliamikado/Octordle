'use client';

import cn from 'classnames';
import CrossIcon from './assets/cross.svg';
import styles from './SettingsPage.module.scss';
import { useRouter } from 'next/navigation';
import { Toggle } from '@/components/Toggle/Toggle';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectChangeDeleteAndEnter, selectDarkTheme } from '@/store/selectors';
import { toggleChangeDeleteAndEnter, toggleDarkTheme } from '@/store/slices/settingsSlice';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

export const SettingsPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const changeDeleteAndEnter = useAppSelector(selectChangeDeleteAndEnter);
    const darkTheme = useAppSelector(selectDarkTheme);
    useEffect(() => {
        localStorage.setItem('settings', JSON.stringify({
            changeDeleteAndEnter,
            darkTheme
        }));

    }, [changeDeleteAndEnter, darkTheme]);
    const [word, setWord] = useState('');
    const [sended, setSended] = useState<'not' | 'delete' | 'add'>('not');
    const changeWord = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        if (input.length > 5) {
            return;
        }
        let ans = '';
        for (let c of input) {
            c = c.toLocaleLowerCase();
            if (c === 'ё') {
                c = 'е';
            }
            if ('а'.charCodeAt(0) <= c.charCodeAt(0) && 'я'.charCodeAt(0) >= c.charCodeAt(0)) {
                ans += c;
            }
        }
        setWord(ans);
    }, [])

    const onSend = useCallback((s: ('delete' | 'add')) => {
        if (word.length === 5) {
            sendToTg(s + ' ' + word);
            setSended(s);
            const wordCopy = word;
            setTimeout(() => {
                setWord((word) => {
                    if (word === wordCopy) {
                        return '';
                    }
                    return word;
                })
                setSended('not');
            }, 5000);
        }
    }, [word]);

    return <div className={styles.page}>
        <h1 className={styles.name}>Осьминогль</h1>
        <button className={cn(styles.icon, styles.crossIcon)} onClick={() => {router.push('.')}}>
            <CrossIcon/>
        </button>
        <div className={styles.block}>
            Поменять местами кнопки Удалить и Ввод
            <Toggle value={changeDeleteAndEnter} changeValue={() => {dispatch(toggleChangeDeleteAndEnter())}}/>
        </div>
        <div className={styles.block}>
            Темная тема
            <Toggle value={darkTheme} changeValue={() => {dispatch(toggleDarkTheme())}}/>
        </div>
        <div className={styles.offerBlock}>
            Наш словарь неполный и постоянно пополняется. Если вы знаете слово, которого нет в игре, можете предложить добавить его.<br/>
            Если же вас возмутило загаданное слово и вы считаете его неподходящим для игры, предложите удалить его.<br/><br/>
            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                <button className={styles.deleteButton} disabled={sended !== 'not'} onClick={() => onSend('delete')}>{sended === 'delete' ? '✓' : 'Удалить'}</button>
                <input placeholder='слово' type='text' className={styles.wordInput} value={word} onChange={changeWord}/>
                <button className={styles.offerButton} disabled={sended !== 'not'} onClick={() => onSend('add')}>{sended === 'add' ? '✓' : 'Добавить'}</button>
            </div>
        </div>
    </div>
}

function sendToTg(word: string) {
    const chat_id = process.env.NEXT_PUBLIC_CHAT_ID;
    const token = process.env.NEXT_PUBLIC_TG_TOKEN;
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            chat_id,
            text: word
        })
    });
}