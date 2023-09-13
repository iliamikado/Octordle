'use client'

import { ReactNode } from "react"

import styles from './MainLayout.module.scss';
import { Provider } from "react-redux";
import { store } from "@/store/store";

interface Props {
    children: ReactNode
}

export const MainLayout = ({children}: Props) => {
    return <Provider store={store}>
        <div className={styles.container} style={{height: window.innerHeight}}>
            {children}
        </div>
    </Provider>
}