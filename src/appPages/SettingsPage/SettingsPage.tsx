'use client';

import cn from 'classnames';
import CrossIcon from './assets/cross.svg';
import styles from './SettingsPage.module.scss';
import { useRouter } from 'next/navigation';
import { Toggle } from '@/components/Toggle/Toggle';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectChangeDeleteAndEnter, selectDarkTheme } from '@/store/selectors';
import { toggleChangeDeleteAndEnter, toggleDarkTheme } from '@/store/slices/settingsSlice';
import { useEffect } from 'react';

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
    </div>
}