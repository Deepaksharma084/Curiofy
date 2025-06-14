import styles from './WordIndexButton.module.css';

export default function Button({ word }) {
    return (
        <button className={styles.btn}>
            <div className={styles.wrapper}>
                <p className={styles.text}>{word}</p>

                <div className={styles.flower + ' ' + styles.flower1}>
                    <div className={styles.petal + ' ' + styles.one} />
                    <div className={styles.petal + ' ' + styles.two} />
                    <div className={styles.petal + ' ' + styles.three} />
                    <div className={styles.petal + ' ' + styles.four} />
                </div>

                <div className={styles.flower + ' ' + styles.flower2}>
                    <div className={styles.petal + ' ' + styles.one} />
                    <div className={styles.petal + ' ' + styles.two} />
                    <div className={styles.petal + ' ' + styles.three} />
                    <div className={styles.petal + ' ' + styles.four} />
                </div>

                <div className={styles.flower + ' ' + styles.flower3}>
                    <div className={styles.petal + ' ' + styles.one} />
                    <div className={styles.petal + ' ' + styles.two} />
                    <div className={styles.petal + ' ' + styles.three} />
                    <div className={styles.petal + ' ' + styles.four} />
                </div>

                <div className={styles.flower + ' ' + styles.flower4}>
                    <div className={styles.petal + ' ' + styles.one} />
                    <div className={styles.petal + ' ' + styles.two} />
                    <div className={styles.petal + ' ' + styles.three} />
                    <div className={styles.petal + ' ' + styles.four} />
                </div>

                <div className={styles.flower + ' ' + styles.flower5}>
                    <div className={styles.petal + ' ' + styles.one} />
                    <div className={styles.petal + ' ' + styles.two} />
                    <div className={styles.petal + ' ' + styles.three} />
                    <div className={styles.petal + ' ' + styles.four} />
                </div>

                <div className={styles.flower + ' ' + styles.flower6}>
                    <div className={styles.petal + ' ' + styles.one} />
                    <div className={styles.petal + ' ' + styles.two} />
                    <div className={styles.petal + ' ' + styles.three} />
                    <div className={styles.petal + ' ' + styles.four} />
                </div>
            </div>
        </button>
    );
}
