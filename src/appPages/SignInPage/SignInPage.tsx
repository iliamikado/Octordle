'use client'

import cn from 'classnames';
import styles from './SignInPage.module.scss';
import CrossIcon from './assets/cross.svg';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getFullStat, getUserInfo, googleAuth, linkEmailAndDevice } from '@/service/service';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectDay, selectMode, selectUserInfo, selectUuid } from '@/store/selectors';
import { setUserInfo, setUuid } from '@/store/slices/settingsSlice';
import { v4 } from 'uuid';
import { Chart, registerables } from 'chart.js';
import chartTrendline from 'chartjs-plugin-trendline';
Chart.register(...registerables, chartTrendline);

declare global {
    interface Window {
        onTelegramAuth: (user: any) => void
    }
}

interface ScoreData {
    day: number,
    score: number,
    mode: string,
    createdAt: string,
}

interface Stats {
    count: number,
    average: number,
    scores: ScoreData[]
}

export const SignInPage = () => {
    const userInfo = useAppSelector(selectUserInfo);
    const dispath = useAppDispatch();
    const day = useAppSelector(selectDay);
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [displayChart, setDisplayChart] = useState(false);
    const uuid = useAppSelector(selectUuid);
    const chart = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart<"line", any, unknown>>();
    const mode = useAppSelector(selectMode);

    useEffect(() => {
        if (userInfo) {
            setTimeout(() => {
                document.querySelector('#telegram-login-octordle_bot')?.remove()
            }, 500)
            return
        }
        const button = document.createElement('script')
        button.async = true
        button.src = 'https://telegram.org/js/telegram-widget.js?22'
        button.setAttribute('data-telegram-login', 'octordle_bot')
        button.setAttribute('data-size', 'medium')
        button.setAttribute('data-radius', '20')
        button.setAttribute('data-onauth', 'onTelegramAuth(user)')
        button.setAttribute('data-request-access', 'write')
        document.body.querySelector('#login_buttons')?.appendChild(button)
        window.onTelegramAuth = function (user) {
            console.log(`Logged in as ${user.first_name} ${user.last_name} ${user.id} (${user.username ?? ''})`)
            dispath(setUserInfo({
                name: `${user.first_name} ${user.last_name}`,
                email: user.id
            }));
            localStorage.setItem('name', `${user.first_name} ${user.last_name}`);
            localStorage.setItem('email', user.id);
            const uuid = localStorage.getItem('uuid');
            if (uuid) {
                linkEmailAndDevice(user.id, uuid, `${user.first_name} ${user.last_name}`);
            }
            document.body.querySelector('#login_buttons')?.removeChild(button)
            document.querySelector('#telegram-login-octordle_bot')?.remove()
        }

        return () => {
            document.body.querySelector('#login_buttons')?.removeChild(button)
            document.querySelector('#telegram-login-octordle_bot')?.remove()
        }
    }, [dispath, userInfo])
    
    useEffect(() => {
        const fragmentString = document.location.hash.substring(1);
        if (fragmentString) {
            const params: any = {};
            const regex = /([^&=]+)=([^&]*)/g;
            for (let m = regex.exec(fragmentString); m != null; m = regex.exec(fragmentString)) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }
            getUserInfo(params['access_token']).then(data => {
                dispath(setUserInfo(data));
                localStorage.setItem('name', data.name);
                localStorage.setItem('email', data.email);
                const uuid = localStorage.getItem('uuid');
                if (uuid) {
                    linkEmailAndDevice(data.email, uuid, data.name);
                }
            })
        }
        document.location.hash = '';
    }, [dispath]);

    useEffect(() => {
        if (!uuid) {
            return;
        }
        getFullStat(uuid, userInfo?.email).then((stats) => {
            if (mode == 'sogra') {
                setStats(stats.personal.sogra)
            } else {
                setStats(stats.personal.standart)
            }
            setTimeout(() => {
                if (!chart.current) {
                    return;
                }

                const ctx = chart.current.getContext('2d');
                if (!ctx) {
                    return;
                }

                let games = [] as ScoreData[];
                if (mode == 'sogra') {
                    games = stats.personal.sogra.scores;
                } else {
                    games = stats.personal.standart.scores;
                }

                const scores = games
                    .filter((x: ScoreData) => (x.day > day - 30))
                    .map((x: ScoreData) => (x.score));
                const average = games
                    .filter((x: ScoreData) => (x.day > day - 30))
                    .map((game: ScoreData) => {
                        let sum = 0, count = 0;
                        games
                            .filter((x: ScoreData) => (x.day > game.day - 30 && x.day <= game.day))
                            .forEach((x: ScoreData) => {sum += x.score; count++})
                        return count === 0 ? 0 : sum / count;
                    });

                if (scores.length == 0) {
                    return;
                }
                
                setDisplayChart(true);
                if (chartRef.current) {
                    chartRef.current.destroy();
                }
                chartRef.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: games.map(({createdAt}) => (formatDate(createdAt))),
                        datasets: [
                            {
                                label: 'баллы',
                                data: scores,
                                fill: false,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1,
                                pointStyle: scores.length === 1,
                                // trendlineLinear: {
                                //     colorMin: 'rgba(255,0,0,0.5)',
                                //     colorMax: 'rgba(255,0,0,0.5)',
                                //     lineStyle: 'solid', // 'solid', 'dotted', 'dashed'
                                //     width: 2,          // толщина линии
                                //     projection: false  // продлевать линию за пределы данных
                                // }
                            } as any,
                            {
                                label: 'среднее',
                                data: average,
                                fill: false,
                                borderColor: 'rgb(192, 75, 75)',
                                tension: 0.1,
                                pointStyle: scores.length === 1,
                            }
                        ]
                    },
                    options: {
                        plugins: {
                            legend: {
                                position: 'top'
                            },
                            tooltip: {
                                enabled: false
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: true, // показывать сетку по оси X
                                    color: 'rgba(128, 115, 115, 0.73)', // цвет линий сетки
                                    lineWidth: 1
                                }
                            },
                            y: {
                                grid: {
                                    display: true, // показывать сетку по оси Y
                                    color: 'rgba(128, 115, 115, 0.73)',
                                    lineWidth: 1
                                }
                            }
                        }
                    }
                })
            }, 500)
        }).catch(e => {
            console.log(e);
        });
    }, [uuid, userInfo, day, mode]);

    return <div className={styles.page}>
        <h1 className={styles.name}>Осьминогль</h1>
        <button className={cn(styles.icon, styles.crossIcon)} onClick={() => {
                router.push(mode ? `/?mode=${mode}` : '/')
            }}>
            <CrossIcon/>
        </button>

        {userInfo ? <div className={styles.logout}>
            <p>Вы вошли как {userInfo.name}</p>
            <button onClick={() => {
                dispath(setUserInfo(null));
                localStorage.removeItem('name');
                localStorage.removeItem('email');
                const newUuid = v4();
                localStorage.setItem('uuid', newUuid);
                dispath(setUuid(newUuid));
            }}>Logout</button>
        </div> : <div className={styles.block} id="login_buttons">
            <p>Мы не знаем, кто вы. Войдите с помощью аккаунта Google, чтобы переносить свой прогресс на разные устройства</p>
            <button onClick={() => {googleAuth()}} className={styles.googleAuth}>Sign in with google</button>
        </div>}

        {stats ? <div className={styles.statsBlock}>
            <h4 style={{margin: 0, marginBottom: 10}}>Личная Статистика {mode === 'sogra' ? '(сложный режим согра)' : ''}</h4>
            <p>Игр сыграно: {stats.count}</p>
            {stats.count > 0 ? <>
                <p>Средний балл: {stats.average}</p>
            </> : null}
            {displayChart ? <p>Баллы за последние 30 дней:</p> : null}
        </div> : null}
        <canvas ref={chart} style={{width: '100%', height: '300px', display: displayChart ? 'block' : 'none'}}></canvas>
        {displayChart ? <div className={styles.block}>
            Среднее - каждое значение на графике считается отдельно за предшествующие ему 30 дней. Пропуски игнорируются.
        </div> : null}
    </div>
}

function formatDate(date: string) {
    const d = new Date(date);
    return new Intl.DateTimeFormat('ru-RU', {
        month: 'short',
        day: 'numeric',
    }).format(d).toString();
}