'use client'

import cn from 'classnames';
import styles from './StatsPage.module.scss';
import CrossIcon from './assets/cross.svg';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFullStat } from '@/service/service';
import { useAppSelector } from '@/store/store';
import { selectUserInfo, selectUuid } from '@/store/selectors';
import Link from 'next/link';
import { Tooltip } from '@/components/Tooltip/Tooltip';

export const StatsPage = () => {
    const [stats, setStats] = useState<any>({loading: true, error: false});
    const uuid = useAppSelector(selectUuid);
    const userInfo = useAppSelector(selectUserInfo);

    useEffect(() => {
        if (!uuid) {
            return;
        }
        getFullStat(uuid, userInfo?.email).then((stats) => {
            setStats(stats);
        }).catch(e => {
            setStats({loading: false, error: true});
            console.log(e);
        });
    }, [uuid, userInfo]);

    const router = useRouter()
    return <div className={styles.page}>
        <h1 className={styles.name}>Осьминогль</h1>
        <button className={cn(styles.icon, styles.crossIcon)} onClick={() => {router.back()}}>
            <CrossIcon/>
        </button>
        {stats.loading ? <div className={styles.log}>загрузка...</div> : stats.error ? <div className={styles.log}>сервер не отвечает</div> : <div>
            {stats.leaderBoard.length > 0 ? <div className={styles.block}>
                <h3 style={{margin: 0}}>Рейтинг <a href='#ps' style={{textDecoration: 'none'}}>*</a></h3>
                <table className={styles.leaderBoard}>
                    <thead>
                        <tr>
                            <th className={styles.cell}>#</th>
                            <th className={styles.cell}>Имя</th>
                            <th className={styles.lastCell}>Счет</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.leaderBoard.map(
                            ({name, score, users, allWords, tries, mode}: {name: string, score: number, users: boolean, allWords: boolean, tries: string, mode: string}, id: number) => 
                            (<tr key={id} className={users ? styles.self : !allWords ? styles.notAllWords : ''}>
                                <td className={styles.cell}>{id + 1}</td>
                                <td className={cn(styles.cell, styles.notCenter)}>
                                    <Tooltip popOn={name} tooltipHeight={150}>
                                        <TriesBlock tries={tries.split(' ').map(Number)} score={score}/>
                                    </Tooltip>
                                </td>
                                <td className={styles.lastCell}>{score} {mode === 'sogra' ? '🧠' : ''}</td>
                        </tr>))}
                    </tbody>
                </table>
            </div> : null}
            <div className={styles.block}>
                <h3 style={{margin: 0}}>Статистика за сегодня</h3>
                <StatBlock stats={stats.today}/>
            </div>
            <div className={styles.block}>
                <h3 style={{margin: 0}}>Статистика за вчера</h3>
                <StatBlock stats={stats.yesterday}/>
            </div>
            {stats.leaderBoard.length > 0 ? <div className={styles.block}>
                <p id='ps'>* - рейтинг среди <Link href='/login'>авторизованных</Link> пользователей</p>
            </div> : null}
        </div>}
    </div>
}

const StatBlock = ({stats}: {stats: any}) => {
    if (stats.finish === 0) {
        return <p>Пока никто не сыграл</p>
    }
    return <>
        {/* <p>Начато игр: {stats.starts}</p> */}
        <p>Человек сыграло: {stats.finish}</p>
        <p>Максимальный балл: {stats.max}</p>
        <p>Минимальный балл: {stats.min}</p>
        <p>Средний балл: {stats.average}</p>
        <p>Медиана: {stats.median}</p>
        {stats.place ? <>
        <p>Ваш балл: {stats.score}</p>
        <p>Ваше место: {stats.place}</p>
        <p>Вы лучше чем {stats.betterThan}% игроков</p>
        <p>Вы сыграли {stats.timePlace} по счету</p>
        </> : null}
    </>
}

const digits = ['🟥', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🕚', '🕛', '🕐', '🕑', '🕒'];
const TriesBlock = ({tries, score}: {tries: number[], score: number}) => {
    return <div className={styles.addInfo}>
        Результат
        <div className={styles.triesBlock}>
            {tries.map((tr, i) => (<div key={i} className={styles.smile}>
                {digits[tr]}
            </div>))}
        </div>
        Счет: {score}
    </div>
}