import cn from 'classnames';
import styles from './Toggle.module.scss';

interface Props {
    value: boolean,
    changeValue: () => void
}

export const Toggle = ({value, changeValue}: Props) => {
    return <div className={cn(styles.back, value ? styles.activeBack : '')} onClick={changeValue}>
        <div className={cn(styles.front, value ? styles.activeFront : '')}></div>
    </div>
}