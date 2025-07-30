'use client'

import { ReactNode, useEffect, useState } from "react"

import styles from './MainLayout.module.scss';
import { Provider } from "react-redux";
import { store, useAppDispatch, useAppSelector } from "@/store/store";
import { setHaveDailyNews, setSettings, setUserInfo, setUuid } from "@/store/slices/settingsSlice";
import { selectDarkTheme } from "@/store/selectors";
import { v4 } from 'uuid';
import { getDayNews } from "@/service/service";
import { setDay } from "@/store/slices/gameSlice";

interface Props {
    children: ReactNode
}

export const MainLayout = ({children}: Props) => {
    const [height, setHeight] = useState('100%');

    useEffect(() => {
        setHeight(`${window.innerHeight}px`);

        const startDay = Math.floor(Date.now() / 1000 / 60 / 60 / 24);
        setInterval(() => {
            if (Math.floor(Date.now() / 1000 / 60 / 60 / 24) > startDay) {
                window.location.reload();
            }
        }, 5000);

        window.addEventListener('resize', () => {
            setHeight(`${window.innerHeight}px`);
        });

    }, [])

    return <Provider store={store}>
        <SetSettings/>
        
        <div className={styles.container} style={{height}}>
            {children}
        </div>
    </Provider>
}

const START_DAY = 19612;

const SetSettings = () => {
    const dispatch = useAppDispatch();
    const darkTheme = useAppSelector(selectDarkTheme);

    useEffect(() => {
        const settings = localStorage.getItem('settings');
        if (settings) {
            dispatch(setSettings(JSON.parse(settings)));
        }
        const uuid = localStorage.getItem('uuid');
        if (uuid) {
            dispatch(setUuid(uuid));
        } else {
            const newUuid = v4();
            localStorage.setItem('uuid', newUuid);
            dispatch(setUuid(newUuid));
        }
    }, [dispatch]);

    useEffect(() => {
        if (darkTheme) {
            document.body.setAttribute('dark', '');
        } else {
            document.body.removeAttribute('dark');
        }
    }, [darkTheme])

    useEffect(() => {
        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');
        if (name && email) {
            dispatch(setUserInfo({name, email}));
        }
    }, [dispatch]);

    useEffect(() => {
        getDayNews().then(newsData => {
            if (newsData.news) {
                dispatch(setHaveDailyNews(true))
            }
        }).catch(e => {})
    }, [dispatch])

    useEffect(() => {
        const day = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - START_DAY;
        dispatch(setDay(day));
    }, [dispatch])

    return null;
}