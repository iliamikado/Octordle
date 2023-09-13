import { ReactNode } from "react"

import styles from './MainLayout.module.scss';

interface Props {
    children: ReactNode
}

export const MainLayout = ({children}: Props) => {
    return <div className={styles.container}>
        {children}
    </div>
}