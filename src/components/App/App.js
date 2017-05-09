import React from 'react'
import styles from './App.scss'

export default () => (
  <div>
    <div className={styles.outer}>
      out
      <div className={styles.inner}>
        out -> in
      </div>
    </div>
    <div className={styles.inner}>
      in
    </div>
  </div>
)