import { useEffect } from "react"
import { Modal } from "../Modal/Modal"

import styles from './NewsModal.module.scss'
import { selectDayNews, selectNews, selectUuid } from "@/store/selectors"
import { useAppSelector } from "@/store/store"
import { sendWatchedNews } from "@/service/service"

interface Props {
    onClose: () => void
}

export const NewsModal = ({onClose}: Props) => {
    const dayNews = useAppSelector(selectDayNews)
    const uuid = useAppSelector(selectUuid)

    useEffect(() => {
        localStorage.setItem('seenNews', 'true')
        sendWatchedNews(uuid)
    }, [uuid])

    return <Modal onClose={onClose}>
        <div className={styles.content}>
            <h3>Новость дня</h3>
            {dayNews ? <>{dayNews.text.split('\n').map((text, i) => (<p key={i} className={styles.text}>{text}</p>))}</> : <p className={styles.text}>Новостей нет</p>}
        </div>
    </Modal>
}

function formatDate(date: string): string {
    const d = new Date(date)
    return add0(d.getDate()) + "." + add0(d.getMonth() + 1) + "." + d.getFullYear()
}

function add0(s: number): string {
    return String(s).length < 2 ? '0' + s : String(s)
}