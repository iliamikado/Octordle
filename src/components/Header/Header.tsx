import { useAppSelector } from '@/store/store';
import styles from './Header.module.scss';
import { selectDay } from '@/store/selectors';
import TutorialIcon from './assets/tutorial.svg';
import SettingsIcon from './assets/settings.svg';
import StatsIcon from './assets/stats.svg';
import PersonIcon from './assets/person.svg';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import { googleAuth } from '@/service/service';

export const Header = () => {
    const router = useRouter();
    const day = useAppSelector(selectDay);
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
    </div>
}