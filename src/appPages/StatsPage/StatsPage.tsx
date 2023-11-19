'use client'

import cn from 'classnames';
import styles from './StatsPage.module.scss';
import CrossIcon from './assets/cross.svg';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFullStat } from '@/service/service';
import { useAppSelector } from '@/store/store';
import { selectUuid } from '@/store/selectors';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

export const StatsPage = () => {
    const [stats, setStats] = useState<any>({loading: true, error: false});
    const uuid = useAppSelector(selectUuid);
    const [graphData, setGraphData] = useState<{uv: number, name?: number}[]>([]);

    useEffect(() => {
        if (!uuid) {
            return;
        }
        getFullStat(uuid).then((stats) => {
            setStats(stats);
            const scores = stats.personal.scores;
            // const data = scores.map(([day, score]: [number, number]) => ({uv: score, name: day}));
            const data = [];
            const startDay = scores[0][0];
            for (let i = 0; i < scores.at(-1)[0] - scores[0][0]; ++i) {
                data.push({uv: 0});
            }
            scores.forEach(([day, score]: [number, number]) => {
                data[day - startDay] = {uv: score, name: day}
            });
            setGraphData(data);

        }).catch(e => {
            setStats({loading: false, error: true});
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
                <LineChart width={550} height={400} data={graphData} style={{width: '100%'}}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" dot={false}/>
                    <XAxis dataKey="name" />
                    <YAxis />
                </LineChart>
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