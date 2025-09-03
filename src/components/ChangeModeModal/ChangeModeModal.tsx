import { useAppSelector } from "@/store/store"
import { Modal } from "../Modal/Modal"
import { selectMode } from "@/store/selectors"
import styles from './ChangModeModal.module.scss'

interface Props {
    onClose: () => void
}

export const ChangeModeModal = ({onClose}: Props) => {

    const mode = useAppSelector(selectMode)

    return <Modal onClose={onClose} hideCross={true}>
        <div className={styles.content}>
            {mode == 'sogra' ?
            "Вы перешли в усложненный режим игры согра"
            :
            "Вы перешли в стандартный режим игры"}
        </div>
        <div className={styles.footer}>
            <button onClick={onClose} className={styles.ok}>
                Ок
            </button>
        </div>
    </Modal>
}