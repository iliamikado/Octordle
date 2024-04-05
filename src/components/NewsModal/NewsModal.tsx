import { useEffect } from "react"
import { Modal } from "../Modal/Modal"

import styles from './NewsModal.module.scss'
import { selectNews } from "@/store/selectors"
import { useAppSelector } from "@/store/store"

interface Props {
    onClose: () => void
}

export const NewsModal = ({onClose}: Props) => {
    const news = useAppSelector(selectNews)

    useEffect(() => {
        if (news.length === 0) {
            return
        }
        let newLastNews = -1
        news.forEach((x: any) => {
            if (newLastNews < x.id) {
                newLastNews = x.id
            }
        })
        localStorage.setItem("lastNews", String(newLastNews))
        localStorage.setItem("seenNews", "true")
    }, [news])

    return <Modal onClose={onClose}>
        <div className={styles.content}>
            <h3>Новости</h3>
            {news.map((n, i) => (<div key={i} className={styles.newsItem}>
                <p className={styles.date}>{formatDate(n.date)}</p>
                <p className={styles.text}>{n.text}</p>
            </div>))}
            {news.length === 0 ? <p>Новостей нет</p> : null}
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