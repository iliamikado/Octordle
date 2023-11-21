'use client'

import cn from 'classnames';
import styles from './StatsPage.module.scss';
import CrossIcon from './assets/cross.svg';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFullStat } from '@/service/service';
import { useAppSelector } from '@/store/store';
import { selectUuid } from '@/store/selectors';

export const StatsPage = () => {
    const [stats, setStats] = useState<any>({loading: true, error: false});
    const uuid = useAppSelector(selectUuid);

    useEffect(() => {
        if (!uuid) {
            return;
        }
        getFullStat(uuid).then((stats) => {
            setStats(stats);
        }).catch(e => {
            setStats({loading: false, error: true});
            console.log(e);
        });
    }, [uuid]);

    const router = useRouter()
    return <div className={styles.page}>
        <h1 className={styles.name}>Осьминогль</h1>
        <button className={cn(styles.icon, styles.crossIcon)} onClick={() => {router.push('.')}}>
            <CrossIcon/>
        </button>
        {stats.loading ? <div className={styles.log}>загрузка...</div> : stats.error ? <div className={styles.log}>сервер не отвечает</div> : <div>
            <div className={styles.block}>
                <h3 style={{margin: 0}}>Статистика за сегодня</h3>
                <StatBlock stats={stats.today}/>
            </div>
            <div className={styles.block}>
                <h3 style={{margin: 0}}>Статистика за вчера</h3>
                <StatBlock stats={stats.yesterday}/>
            </div>
            <div className={styles.block}>
                <h3 style={{margin: 0}}>Личная Статистика</h3>
                <p>Игр сыграно: {stats.personal.played}</p>
                <p>Средний балл: {stats.personal.average}</p>
            </div>
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
        <p>Ваше место: {stats.place[0] === stats.place[1] ? stats.place[0] : `${stats.place[0]} - ${stats.place[1]}`}</p>
        <p>Вы лучше чем {stats.betterThan}% игроков</p>
        <p>Вы сыграли {stats.timePlace} по счету</p>
        </> : null}
    </>
}