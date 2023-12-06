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
        console.log(location);
        const fragmentString = document.location.hash.substring(1);
        if (fragmentString) {
            const params: any = {};
            const regex = /([^&=]+)=([^&]*)/g;
            for (let m = regex.exec(fragmentString); m != null; m = regex.exec(fragmentString)) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }
            localStorage.setItem('access_token', params['access_token']);
            console.log(params);
            getUserInfo(params['access_token']).then(data => {
                dispath(setUserInfo(data));
                const uuid = localStorage.getItem('uuid');
                if (uuid) {
                    linkEmailAndDevice(data.email, uuid);
                }
            })
        }
    }, [dispath]);

    return <div className={styles.page}>
        <h1 className={styles.name}>Осьминогль</h1>
        <button className={cn(styles.icon, styles.crossIcon)} onClick={() => {router.push('.')}}>
            <CrossIcon/>
        </button>

        {userInfo ? <div>
            <p>Вы вошли как {userInfo.name}</p>
        </div> : <div className={styles.block}>
            <p>Мы не знаем, кто вы. Войдите с помощью аккаунта Google, чтобы переносить свой прогресс на разные устройства</p>
            <button onClick={() => {googleAuth()}} className={styles.googleAuth}>Sign in with google</button>
        </div>}
    </div>
}