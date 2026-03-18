'use client'

import cn from 'classnames';
import styles from './StatsPage.module.scss';
import CrossIcon from './assets/cross.svg';
import { useEffect, useState } from 'react';
import { getFullStat, getLeaderBoard } from '@/service/service';
import { useAppSelector } from '@/store/store';
import { selectMode, selectUserInfo, selectUuid } from '@/store/selectors';
import Link from 'next/link';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { useParamsRouter } from '@/components/ParamsRouter/ParamsRouter';

type LeaderBoardRow = {
    name: string,
    score: number,
    users: boolean,
    allWords: boolean,
    tries: string,
    mode: string,
}

export const StatsPage = () => {
    const [stats, setStats] = useState<any>({loading: true, error: false});
    const [leaderBoard, setLeaderBoard] = useState({
        loading: true,
        error: false,
        day: 0,
        currentDay: 0,
        items: [] as LeaderBoardRow[],
    });
    const uuid = useAppSelector(selectUuid);
    const userInfo = useAppSelector(selectUserInfo);
    const mode = useAppSelector(selectMode);

    useEffect(() => {
        if (!uuid) {
            return;
        }
        setStats({loading: true, error: false});
        setLeaderBoard({
            loading: true,
            error: false,
            day: 0,
            currentDay: 0,
            items: [],
        });
        getFullStat(uuid, userInfo?.email).then((nextStats) => {
            setStats({
                ...nextStats,
                loading: false,
                error: false,
            });
            setLeaderBoard({
                loading: false,
                error: false,
                day: nextStats.leaderBoardDay ?? nextStats.currentDay ?? 0,
                currentDay: nextStats.currentDay ?? 0,
                items: nextStats.leaderBoard ?? [],
            });
        }).catch(e => {
            setStats({loading: false, error: true});
            setLeaderBoard({
                loading: false,
                error: true,
                day: 0,
                currentDay: 0,
                items: [],
            });
        });
    }, [uuid, userInfo?.email]);

    const loadLeaderBoard = (day: number) => {
        if (!uuid) {
            return;
        }

        const nextDay = Math.max(0, Math.min(day, leaderBoard.currentDay));
        if (nextDay === leaderBoard.day) {
            return;
        }

        setLeaderBoard(prev => ({
            ...prev,
            loading: true,
            error: false,
        }));

        getLeaderBoard(nextDay, userInfo?.email).then((resp) => {
            setLeaderBoard({
                loading: false,
                error: false,
                day: resp.day,
                currentDay: resp.currentDay,
                items: resp.leaderBoard ?? [],
            });
        }).catch(() => {
            setLeaderBoard(prev => ({
                ...prev,
                loading: false,
                error: true,
            }));
        });
    }

    const router = useParamsRouter();
    const modeName = mode == '' ? 'standart' : 'sogra';
    return <div className={styles.page}>
        <h1 className={styles.name}>Осьминогль</h1>
        <button className={cn(styles.icon, styles.crossIcon)} onClick={() => {router.push('/')}}>
            <CrossIcon/>
        </button>
        {stats.loading ? <div className={styles.log}>загрузка...</div> : stats.error ? <div className={styles.log}>сервер не отвечает</div> : <div>
            <div className={styles.block}>
                <div className={styles.leaderBoardHeader}>
                    <h3 style={{margin: 0}}>Рейтинг <a href='#ps' style={{textDecoration: 'none'}}>*</a></h3>
                    <div className={styles.leaderBoardControls}>
                        <button
                            className={styles.arrowButton}
                            onClick={() => loadLeaderBoard(leaderBoard.day - 1)}
                            disabled={leaderBoard.loading || leaderBoard.day <= 0}
                        >
                            ←
                        </button>
                        <span className={styles.dayLabel}>День: {leaderBoard.day}</span>
                        <button
                            className={styles.arrowButton}
                            onClick={() => loadLeaderBoard(leaderBoard.day + 1)}
                            disabled={leaderBoard.loading || leaderBoard.day >= leaderBoard.currentDay}
                        >
                            →
                        </button>
                    </div>
                </div>
                {leaderBoard.error ? <div className={styles.leaderBoardStatus}>не удалось обновить рейтинг</div> : null}
                {leaderBoard.items.length > 0 ? <table className={styles.leaderBoard}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th className={styles.cell}>Имя</th>
                            <th></th>
                            <th className={styles.cell}>Счет</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderBoard.items.map(
                            ({name, score, users, allWords, tries, mode}: LeaderBoardRow, id: number) =>
                            (<tr key={id} className={users ? styles.self : !allWords ? styles.notAllWords : ''}>
                                <td>{id + 1}</td>
                                <td className={cn(styles.cell, styles.notCenter)}>
                                    <Tooltip popOn={name} tooltipHeight={150}>
                                        <TriesBlock tries={tries.split(' ').map(Number)} score={score}/>
                                    </Tooltip>
                                </td>
                                <td>{mode === 'sogra' ? '🧠' : ''}</td>
                                <td className={styles.cell}>{score}</td>
                            </tr>))}
                    </tbody>
                </table> : <p>В этот день пока никто не сыграл</p>}
            </div>
            <div className={styles.block}>
                <h3 style={{margin: 0}}>Статистика за сегодня</h3>
                <StatBlock stats={stats.today} modeStats={stats.today[modeName]}/>
            </div>
            <div className={styles.block}>
                <h3 style={{margin: 0}}>Статистика за вчера</h3>
                <StatBlock stats={stats.yesterday} modeStats={stats.yesterday[modeName]}/>
            </div>
            {leaderBoard.items.length > 0 ? <div className={styles.block}>
                <p id='ps'>* - рейтинг среди <Link href='/login'>авторизованных</Link> пользователей</p>
                <p id='sogra'>🧠 - усложненный режим игры <Link href='/?mode=sogra'>согра</Link></p>
            </div> : null}
        </div>}
    </div>
}

const StatBlock = ({stats, modeStats}: {stats: any, modeStats: any}) => {
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
        {modeStats ? <>
        <p>Ваш балл: {modeStats.score}</p>
        <p>Ваше место: {modeStats.place}</p>
        <p>Вы лучше чем {modeStats.betterThan}% игроков</p>
        <p>Вы сыграли {modeStats.timePlace} по счету</p>
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
