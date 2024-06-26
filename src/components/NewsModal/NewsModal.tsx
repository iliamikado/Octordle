import { useEffect, useState } from "react"
import { Modal } from "../Modal/Modal"

import styles from './NewsModal.module.scss'
import { selectUuid } from "@/store/selectors"
import { useAppSelector } from "@/store/store"
import { getDayNews, sendWatchedNews } from "@/service/service"
import cn from "classnames"

interface Props {
    onClose: () => void
}

interface News {
    id: number,
    text: string,
    date: string
  }

export const NewsModal = ({onClose}: Props) => {
    const uuid = useAppSelector(selectUuid)
    const [news, setNews] = useState<null | News>(null)
    const [haveNext, setHaveNext] = useState(false)
    const [newsNumber, setNewsNumber] = useState(0)

    useEffect(() => {
        getDayNews(newsNumber).then(data => {
            console.log(data)
            if (data.news) {
                setNews(data.news)
            }
            setHaveNext(data.haveNext)
        })
    }, [newsNumber])

    useEffect(() => {
        localStorage.setItem('seenNews', 'true')
        sendWatchedNews(uuid)
    }, [uuid])

    return <Modal onClose={onClose}>
        <div className={styles.content}>
            <h3>Новость дня</h3>
            {news ? <>{news.text.split('\n').map((text, i) => (<p key={i} className={styles.text}>{text}</p>))}</> : <p className={styles.text}>Новостей нет</p>}
        </div>
        <div className={styles.footer}>
            <button className={cn(styles.left, newsNumber > 0 ? '' : styles.invis)}
                onClick={() => setNewsNumber((state) => (state - 1))}>🢀</button>
            <button className={cn(styles.right, haveNext ? '' : styles.invis)}
                onClick={() => setNewsNumber((state) => (state + 1))}>🢂</button>
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