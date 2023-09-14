import { useAppSelector } from '@/store/store';
import styles from './Header.module.scss';
import { selectDay } from '@/store/selectors';

export const Header = () => {
    const day = useAppSelector(selectDay);
    return <div className={styles.header}>
        <h1 className={styles.title}>Осьминогль</h1>
        <h3 className={styles.day}>День #{day}</h3>
    </div>
}