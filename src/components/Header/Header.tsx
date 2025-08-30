import { useAppDispatch, useAppSelector } from '@/store/store';
import styles from './Header.module.scss';
import { selectDay, selectHaveDailyNews, selectMode } from '@/store/selectors';
import TutorialIcon from './assets/tutorial.svg';
import SettingsIcon from './assets/settings.svg';
import StatsIcon from './assets/stats.svg';
import PersonIcon from './assets/person.svg';
import BellIcon from './assets/bell.svg';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { NewsModal } from '../NewsModal/NewsModal';
import Lottie from 'react-lottie';
import BellAnimation from './assets/bellAnimation.json'
import DevilIcon from './assets/devil.svg'
import { useParamsRouter } from '../ParamsRouter/ParamsRouter';
import { setMode } from '@/store/slices/gameSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeModeModal } from '../ChangeModeModal/ChangeModeModal';

export const Header = () => {
    const router = useParamsRouter();
    const day = useAppSelector(selectDay);
    const dispath = useAppDispatch();
    const [showNews, setShowNews] = useState(false);
    const [newNews, setNewNews] = useState(false);
    const [showChangeModal, setShowChangeModal] = useState(false);
    const haveDailyNews = useAppSelector(selectHaveDailyNews);
    const mode = useAppSelector(selectMode);
    useEffect(() => {
        if (haveDailyNews && localStorage.getItem("seenNews") !== "true") {
            setNewNews(true);
        }
    }, [haveDailyNews])

    return <div className={styles.header}>
        <button className={cn(styles.icon, styles.tutorialIcon)} onClick={() => {router.push('info')}}>
            <TutorialIcon/>
        </button>
        <button className={cn(styles.icon, styles.settingsIcon)} onClick={() => {router.push('settings')}}>
            <SettingsIcon/>
        </button>
        <button className={cn(styles.icon, styles.statsIcon)} onClick={() => {router.push('stats')}}>
            <StatsIcon/>
        </button>
        <button className={cn(styles.icon, styles.personIcon)} onClick={() => {router.push('login')}}>
            <PersonIcon/>
        </button>
        <h1 className={styles.title}>Осьминогль</h1>
        <button className={cn(styles.icon, styles.devilIcon, mode === 'sogra' ? styles.sograMode : "")} onClick={() => {
            const urlParams = new URLSearchParams(window.location.search);
            if (mode === 'sogra') {
                dispath(setMode(''))
                urlParams.delete('mode')
            } else {
                dispath(setMode('sogra'))
                urlParams.set('mode', 'sogra')
            }
            router.changeParams(urlParams.toString());
            setShowChangeModal(true);
        }}>
            <DevilIcon/>
        </button>
        <h3 className={styles.day}>День #{day}</h3>
        <button className={cn(styles.icon, styles.bellIcon, haveDailyNews ? "" : styles.noNewNews)} onClick={() => setShowNews(true)}>
            {newNews && haveDailyNews ? <AnimatedBell/> : <BellIcon/>}
        </button>

        {showNews ? <NewsModal onClose={() => {
            setShowNews(false);
            setNewNews(false)
        }}/> : null}

        {showChangeModal ? <ChangeModeModal onClose={() => {setShowChangeModal(false)}}/> : null}

    </div>
}

const AnimatedBell = () => {
    return <div className={styles.animatedBell}>
        <Lottie
            options={{
                loop: true,
                autoplay: true,
                animationData: BellAnimation
            }}
            width={35}
            height={35}
        />
    </div>
}