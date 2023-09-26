'use client'

import cn from 'classnames';
import styles from './InfoPage.module.scss';
import CrossIcon from './assets/cross.svg';
import { useRouter } from 'next/navigation';

export const InfoPage = () => {
    const router = useRouter()
    return <div className={styles.page}>
        <h1 className={styles.name}>Осьминогль</h1>
        <button className={cn(styles.icon, styles.crossIcon)} onClick={() => {router.push('.')}}>
            <CrossIcon/>
        </button>
        <div className={styles.block}>
            <p className={styles.title}>Отгадай все слова за ограниченное число попыток</p>
            Вводи корректные слова из пяти букв и нажимай кнопку ввода. <br/>
            После каждой попытки, буквы будут подсвечиваться определенным цветом, чтобы показать, насколько близко твое предположение к загаданному слову:<br/>
            1. Зеленый цвет - такая буква есть и стоит она на том же месте.<br/>
            2. Желтый цвет - такая буква есть, но она стоит на другом месте.<br/>
            3. Серый цвет - такой буквы в слове нет.<br/>
            Дополнительно - если в вашем предположении две одинаковые буквы, а в загаданном только одна, то одна из букв будет серой. Однако если в загадонном слове две таких буквы, то будут отмечены обе.
        </div>
        <div className={styles.block}>
            <p className={styles.title}>Пример</p>
            Загаданное слово - <b>акула</b> <br/>
            Попытки:<br/>
            <Word word='лимон' mask={['w', 'n', 'n', 'n', 'n']}/>
            В слове акула есть только буква Л, но она стоит на другом месте, поэтому желтый цвет.
            <Word word='арбуз' mask={['r', 'n', 'n', 'w', 'n']}/>
            Буква А стоит на правильном месте, значит зеленый цвет. Буква У есть, но на другом месте, значит желтый.
            <Word word='кукла' mask={['w', 'w', 'n', 'r', 'r']}/>
            Тут можно заметить, что первая буква К желтая, а вторая серая. Это потому что в слове акула только одна буква К.
            <Word word='баран' mask={['n', 'w', 'n', 'w', 'n']}/>
            Здесь обе буквы А желтые, значит в слове две буквы А, но они обе на других местах.
            <Word word='акула' mask={['r', 'r', 'r', 'r', 'r']}/>
            И наконец акула полностью зеленая. Следовательно, мы отгадали слово
        </div>
    </div>
}

const Word = ({word, mask}: {word: string, mask: string[]}) => {
    return <div className={styles.word}>
        {word.split('').map((c, i) => (<div className={cn(styles.letter, styles[mask[i]])} key={i}>{c}</div>))}
    </div>
}