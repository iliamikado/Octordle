import cn from 'classnames';

import styles from './Keyboard.module.scss';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { addCurrentInputToTries, addLetterToCurrentInput, removeLetterFromCurrentInput, setChosenInput } from '@/store/slices/gameSlice';
import { selectKeyboardMask, selectWordsMask } from '@/store/selectors';

const keys = [
    ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
    ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
    ['del', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', 'enter']
];

export const Keyboard = () => {
    const dispatch = useAppDispatch();
    const keyboardMask = useAppSelector(selectKeyboardMask);
    const wordsMask = useAppSelector(selectWordsMask);

    return <div className={styles.keyboard}>
        <div className={styles.wordsMask}>
            {wordsMask.map((x, i) => (
                <div key={i}
                    onClick={() => {
                        dispatch(setChosenInput(i));
                        document.querySelector(`#wordsInput${i}`)?.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }}
                    className={cn(styles.wordMask, x ? styles.guessed : '')}>
                        {x ? '✓' : i + 1}
                </div>
            ))}
        </div>
        {keys.map((r, i) => (
            <div key={i} className={styles.row}>
                {r.map(c => {
                    if (c === 'del') {
                        return <div key={c} className={cn(styles.key, styles.funcKey)} onClick={() => {dispatch(removeLetterFromCurrentInput())}}>⌫</div>
                    } else if (c === 'enter') {
                        return <div key={c} className={cn(styles.key, styles.funcKey)} onClick={() => {dispatch(addCurrentInputToTries())}}>⏎</div>
                    } else {
                        return <div
                            className={cn(styles.key, keyboardMask[c] ? styles.pressedKey : '')}
                            key={c}
                            onClick={() => {dispatch(addLetterToCurrentInput(c))}}>
                                {keyboardMask[c] ? keyboardMask[c].map((st: string, i: number) => (
                                    <div key={i} className={cn(styles[st], styles.keyFragment)}
                                        style={{
                                            left: `${i % 2 * 50}%`,
                                            top: `${Math.floor(i / 2) * 100 / Math.floor((keyboardMask[c].length + 1) / 2)}%`,
                                            height: `${100 / Math.floor((keyboardMask[c].length + 1) / 2)}%`
                                        }}
                                    ></div>
                                )) : null}
                                <span>{c}</span>
                        </div>
                    }
                })}
            </div>
        ))}
    </div>
}