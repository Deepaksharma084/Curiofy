import styles from './Hamburger.module.css';

export default function Hamburger({ isOpen, onClick }) {
    return (
        <div className={`z-50 ${styles.background} ${isOpen ? styles.open : ''}`}>
            <button onClick={onClick} className={styles.menu__icon}>
                <span />
                <span />
                <span />
            </button>
        </div>
    );
}
