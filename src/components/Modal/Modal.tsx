import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import Cross from "./assets/cross.svg";

import styles from "./Modal.module.scss";

interface Props {
    children: ReactNode;
    onClose: () => void;
}

export const Modal = ({ children, onClose }: Props) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return createPortal(
        <div className={styles.container}>
            <div className={styles.back} onClick={onClose}></div>
            <div className={styles.modal}>
                <button
                    className={styles.crossBtn}
                    onClick={onClose}
                    aria-label="Закрыть модальное окно"
                >
                    <Cross />
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};
