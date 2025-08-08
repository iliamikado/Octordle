import { useAppSelector } from '@/store/store';
import styles from './Header.module.scss';
import { selectDay, selectHaveDailyNews } from '@/store/selectors';
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
import { useParamsRouter } from '../ParamsRouter/ParamsRouter';

export const Header = () => {
    const router = useParamsRouter();
    const day = useAppSelector(selectDay);
    const [showNews, setShowNews] = useState(false);
    const [newNews, setNewNews] = useState(false);
    const haveDailyNews = useAppSelector(selectHaveDailyNews);
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
        <h3 className={styles.day}>День #{day}</h3>
        <button className={cn(styles.icon, styles.bellIcon, haveDailyNews ? "" : styles.noNewNews)} onClick={() => setShowNews(true)}>
            {newNews && haveDailyNews ? <AnimatedBell/> : <BellIcon/>}
        </button>

        {showNews ? <NewsModal onClose={() => {
            setShowNews(false);
            setNewNews(false)
        }}/> : null}

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