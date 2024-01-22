'use client'

import cn from 'classnames';
import styles from './InfoPage.module.scss';
import CrossIcon from './assets/cross.svg';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
            После каждой попытки буквы будут подсвечиваться определенным цветом:<br/>
            1. Зеленый - буква есть и стоит на правильном месте.<br/>
            2. Желтый - буква есть, но стоит на другом месте.<br/>
            3. Серый - такой буквы в слове нет.<br/>
            Eсли в вашем варианте две одинаковые буквы, а в загаданном только одна, то подсвечиваться будет только одна из них. Если в загаданном слове две одинаковых буквы, то подсвечены будут обе.
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
            <Word word='согра' mask={['h', 'h', 'h', 'h', 'h']}/>
            Розовый цвет означает, что введеное слово сложное, и оно точно не было загадано, однако его можно использовать для разгадывания. По умолчанию это подсвечивание выключено. Включить функцию можно в <Link href='/settings'>настройках</Link>
        </div>
        <div className={styles.block}>
            <p className={styles.title}>Клавиатура</p>
            Клавиатура умная и подсвечивает буквы которые вы угадали.<br/>
            Делает она это сразу для всех полей, но если нажать на конкретное поле, то будет подсвечивать только для него.
        </div>
        <div className={styles.block}>
            <p className={styles.title}>Результат</p>
            В конце игры вы увидите попытки, потраченные на отгадывание слов, и общий счет.<br/>
            Количество попыток отображаются в виде цифр (от 1 до 10) и часов (от 11 до 14). Например, 11 попыток будет отображаться как 11 часов 🕚<br/> 
            Правило подсчета очков: за каждое отгаданное слово 20 минус количество потраченных на это слово попыток.
        </div>
        <div className={styles.block}>
            <p className={styles.title}>Контакты</p>
            <a href='https://t.me/octordlechat'>Чат в Телеграме</a>
        </div>
    </div>
}

const Word = ({word, mask}: {word: string, mask: string[]}) => {
    return <div className={styles.word}>
        {word.split('').map((c, i) => (<div className={cn(styles.letter, styles[mask[i]])} key={i}>{c}</div>))}
    </div>
}