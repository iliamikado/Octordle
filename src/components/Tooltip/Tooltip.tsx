import { ReactNode, useState } from "react"

import styles from './Tooltip.module.scss'

interface Props {
    children: ReactNode,
    popOn: ReactNode,
    tooltipTop: number
}

export const Tooltip = ({children, popOn, tooltipTop}: Props) => {
    return <div className={styles.tooltip}>
        {popOn}
        <div className={styles.tooltipContent} style={{top: `${-tooltipTop}px`}}>
            {children}
        </div>
    </div>
}