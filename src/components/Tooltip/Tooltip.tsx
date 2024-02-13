import { ReactNode, useState } from "react"

import styles from './Tooltip.module.scss'

interface Props {
    children: ReactNode,
    popOn: ReactNode,
    tooltipHeight: number
}

export const Tooltip = ({children, popOn, tooltipHeight}: Props) => {
    return <div className={styles.tooltip}>
        {popOn}
        <div className={styles.tooltipContent} style={{
            top: `calc(50% - ${tooltipHeight / 2}px)`,
            height: `${tooltipHeight}px`
        }}>
            {children}
        </div>
    </div>
}