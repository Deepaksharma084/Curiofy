import React from 'react';
import styles from './Loader.module.css';

export default function Loader(){
  return (
      <div className={styles.wrapper}>
        <div className={styles.circle} />
        <div className={styles.circle} />
        <div className={styles.circle} />
        <div className={styles.shadow} />
        <div className={styles.shadow} />
        <div className={styles.shadow} />
      </div>
  );
}