import { useEffect, useState } from "react"
import { Modal } from "../Modal/Modal"
import { getNews } from "@/service/service"

import styles from './NewsModal.module.scss'

interface Props {
    onClose: () => void
}

interface News {
    text: string,
    createdAt: string
}

export const NewsModal = ({onClose}: Props) => {
    const [news, setNews] = useState<News[]>([])
    useEffect(() => {
        getNews().then((data: any) => {
            data.sort((a: News, b: News) => {
                const d1 = new Date(a.createdAt)
                const d2 = new Date(b.createdAt)
                return d2.getTime() - d1.getTime()
            })
            setNews(data)
            console.log(data)
        })
    }, [])

    return <Modal onClose={onClose}>
        <div className={styles.content}>
            <h3>Новости</h3>
            {news.map((n, i) => (<div key={i} className={styles.newsItem}>
                <p className={styles.date}>{formatDate(n.createdAt)}</p>
                <p className={styles.text}>{n.text}</p>
            </div>))}
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