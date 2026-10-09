'use client';

import cn from 'classnames';
import CrossIcon from './assets/cross.svg';
import styles from './SettingsPage.module.scss';
import { Toggle } from '@/components/Toggle/Toggle';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectChangeDeleteAndEnter, selectDarkTheme, selectHighlightHardWords, selectUserInfo } from '@/store/selectors';
import { toggleChangeDeleteAndEnter, toggleDarkTheme, toggleHighlightHardWords } from '@/store/slices/settingsSlice';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useParamsRouter } from '@/components/ParamsRouter/ParamsRouter';
import { sendWordOffer } from '@/service/service';

export const SettingsPage = () => {
    const router = useParamsRouter();
    const dispatch = useAppDispatch();
    const changeDeleteAndEnter = useAppSelector(selectChangeDeleteAndEnter);
    const darkTheme = useAppSelector(selectDarkTheme);
    const highlightHardWords = useAppSelector(selectHighlightHardWords);
    const userName = useAppSelector(selectUserInfo)?.name;

    useEffect(() => {
        localStorage.setItem('settings', JSON.stringify({
            changeDeleteAndEnter,
            darkTheme,
            highlightHardWords
        }));

    }, [changeDeleteAndEnter, darkTheme, highlightHardWords]);
    const [word, setWord] = useState('');
    const [sended, setSended] = useState<'not' | 'delete' | 'add'>('not');
    const [isSending, setIsSending] = useState(false);

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

    const onSend = useCallback(async (s: ('delete' | 'add')) => {
        if (isSending) {
            return;
        }

        if (word.length === 5) {
            try {
                setIsSending(true);
                await sendWordOffer(s, word, userName);
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
            } catch (error) {
                console.error('Failed to send word offer', error);
            } finally {
                setIsSending(false);
            }
        }
    }, [isSending, word, userName]);

    return <div className={styles.page}>
        <h1 className={styles.name}>Осьминогль</h1>
        <button className={cn(styles.icon, styles.crossIcon)} onClick={() => {router.push('/')}}>
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
        <div className={styles.block}>
            Подсвечивать сложные слова
            <Toggle value={highlightHardWords} changeValue={() => {dispatch(toggleHighlightHardWords())}}/>
        </div>
        <div className={styles.offerBlock}>
            Наш словарь неполный и постоянно пополняется. Если вы знаете слово, которого нет в игре, можете предложить добавить его.<br/>
            Если же вас возмутило загаданное слово и вы считаете его неподходящим для игры, предложите удалить его.<br/><br/>
            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', gap: '5px'}}>
                <button className={styles.deleteButton} disabled={sended !== 'not' || isSending} onClick={() => onSend('delete')}>{sended === 'delete' ? '✓' : 'Удалить'}</button>
                <input placeholder='слово' type='text' className={styles.wordInput} value={word} onChange={changeWord}/>
                <button className={styles.offerButton} disabled={sended !== 'not' || isSending} onClick={() => onSend('add')}>{sended === 'add' ? '✓' : 'Добавить'}</button>
            </div>
        </div>
    </div>
}
