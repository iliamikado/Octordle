'use client'

import cn from 'classnames';
import styles from './SignInPage.module.scss';
import CrossIcon from './assets/cross.svg';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getFullStat, getUserInfo, googleAuth, linkEmailAndDevice } from '@/service/service';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectUserInfo, selectUuid } from '@/store/selectors';
import { setUserInfo, setUuid } from '@/store/slices/settingsSlice';
import { v4 } from 'uuid';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

declare global {
    interface Window {
        onTelegramAuth: (user: any) => void
    }
}

export const SignInPage = () => {
    const userInfo = useAppSelector(selectUserInfo);
    const dispath = useAppDispatch();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const uuid = useAppSelector(selectUuid);
    const chart = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart<"line", any, unknown>>();

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
            setStats(stats);
            setTimeout(() => {
                if (!chart.current) {
                    return;
                }

                const ctx = chart.current.getContext('2d');
                if (!ctx) {
                    return;
                }

                stats.personal.scores = stats.personal.scores.sort((a: [number, number], b: [number, number]) => (a[0] - b[0]));

                const scores = stats.personal.scores.map((x: [number, number]) => (x[1]));
                if (chartRef.current) {
                    chartRef.current.destroy();
                }
                chartRef.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: scores.map(() => ('')),
                        datasets: [
                            {
                                data: scores,
                                fill: false,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1,
                                pointStyle: false
                            }
                        ]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                enabled: false
                            }
                        }
                    }
                })
            }, 500)
        }).catch(e => {
            setStats({loading: false, error: true});
            console.log(e);
        });
    }, [uuid, userInfo]);

    return <div className={styles.page}>
        <h1 className={styles.name}>Осьминогль</h1>
        <button className={cn(styles.icon, styles.crossIcon)} onClick={() => {router.push('.')}}>
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

        {stats && !stats.error ? <div className={styles.statsBlock}>
            <h3 style={{margin: 0}}>Личная Статистика</h3>
            <p>Игр сыграно: {stats.personal.played}</p>
            {stats.personal.played > 0 ? <>
                <p>Средний балл: {stats.personal.average}</p>
                <p>Баллы за все время:</p>
            </> : null}
        </div> : null}
        <canvas ref={chart} style={{width: '100%', height: '300px', display: stats?.personal?.played > 0 ? 'block' : 'none'}}></canvas>
    </div>
}