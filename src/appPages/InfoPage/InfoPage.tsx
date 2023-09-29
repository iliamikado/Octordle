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
            <p className={styles.title}>Отгадай все слова за 14 попыток</p>
            Вводи корректные слова и нажимай кнопку ввода, несуществующие слова не принимаются. <br/>
            После каждой попытки, буквы будут подсвечиваться определенным цветом:<br/>
            1. Зеленый - буква есть и стоит на правильном месте.<br/>
            2. Желтый - буква есть, но стоит на другом месте.<br/>
            3. Серый - такой буквы в слове нет.<br/>
            Eсли в вашем варианте две одинаковые буквы, а в загаданном только одна, то подсвечиваться будет только одна из них. Если в загадонном слове две одинаковых буквы, то подсвечены будут обе.
        </div>
        <div className={styles.block}>
            <p className={styles.title}>Пример</p>
            Загаданное слово - <b>акула</b> <br/>
            Попытки:<br/>
            <Word word='арбуз' mask={['r', 'n', 'n', 'w', 'n']}/>
            А - угадана и стоит на правильном месте.<br/>
            У - угадана, но стоит на другом месте.
            <Word word='кукла' mask={['w', 'w', 'n', 'r', 'r']}/>
            первая буква К желтая - угадана, но стоит в другом месте<br/>
            вторая буква К серая - второй буквы К нет.<br/>
            буквы Л и А угаданы и стоят в нужных местах
            <Word word='акула' mask={['r', 'r', 'r', 'r', 'r']}/>
            Все буквы зеленые, вы отгадали слово.
            <Word word='белый' mask={['o', 'o', 'o', 'o', 'o']}/>
            Оранжевый цвет означает, что введеное слово некорректное. Можно вводить только существующие существительные
        </div>
        <div className={styles.block}>
            <p className={styles.title}>Интерфейс</p>
            Клавиатура будет подсвечиваться, указывая какие буквы вы угадали.<br/>
            Изначально подсветка идет для всех слов, но можно нажать на определенное слово, чтобы подсветка была только для него. <br/>
        </div>
    </div>
}

const Word = ({word, mask}: {word: string, mask: string[]}) => {
    return <div className={styles.word}>
        {word.split('').map((c, i) => (<div className={cn(styles.letter, styles[mask[i]])} key={i}>{c}</div>))}
    </div>
}