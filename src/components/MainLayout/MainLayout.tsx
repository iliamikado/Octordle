'use client'

import { ReactNode, useEffect, useState } from "react"

import styles from './MainLayout.module.scss';
import { Provider } from "react-redux";
import { store } from "@/store/store";

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
        })
    }, [])

    return <Provider store={store}>
        <div className={styles.container} style={{height}}>
            {children}
        </div>
    </Provider>
}