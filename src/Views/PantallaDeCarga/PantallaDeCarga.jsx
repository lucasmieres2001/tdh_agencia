import React from 'react';
import { useEffect } from 'react';
import styles from './PantallaDeCarga.module.css';
import AOS from 'aos';


export default function PantallaDeCarga() {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
      }, []);
  return (
    <div className={styles.container}>
      <div className={styles.sky}>
        <div className={styles.cloud}></div>
        <div className={styles.cloud}></div>
        <div className={styles.cloud}></div>
        <div className={styles.cloud}></div>
        <div className={styles.cloud}></div>
        <div className={styles.cloud}></div>
        <div className={styles.plane}></div>
      </div>
      <h1 data-aos="zoom-in" className={styles.message}>Buscando su mejor vuelo...</h1>
    </div>
  );
}
