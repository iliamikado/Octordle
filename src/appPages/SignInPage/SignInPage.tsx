'use client'

import cn from 'classnames';
import styles from './SignInPage.module.scss';
import CrossIcon from './assets/cross.svg';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getUserInfo, googleAuth, linkEmailAndDevice } from '@/service/service';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectUserInfo } from '@/store/selectors';
import { setUserInfo } from '@/store/slices/settingsSlice';

export const SignInPage = () => {
    const userInfo = useAppSelector(selectUserInfo);
    const dispath = useAppDispatch();
    const router = useRouter();
    
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
    }, [dispath]);

    return <div className={styles.page}>
        <h1 className={styles.name}>Осьминогль</h1>
        <button className={cn(styles.icon, styles.crossIcon)} onClick={() => {router.push('.')}}>
            <CrossIcon/>
        </button>

        {userInfo ? <div className={styles.block}>
            <p>Вы вошли как {userInfo.name}</p>
            <button onClick={() => {
                dispath(setUserInfo(null));
                localStorage.removeItem('name');
                localStorage.removeItem('email');
            }} className={styles.googleAuth}>Logout</button>
        </div> : <div className={styles.block}>
            <p>Мы не знаем, кто вы. Войдите с помощью аккаунта Google, чтобы переносить свой прогресс на разные устройства</p>
            <button onClick={() => {googleAuth()}} className={styles.googleAuth}>Sign in with google</button>
        </div>}
    </div>
}