/* External Dependencies */
import React from 'react'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './App.scss'
import LabelList from '../LabelList'
import MemoEditor from '../MemoEditor'
import MemoList from '../MemoList'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      labels: Immutable.List(),
      memos: Immutable.List(),
      curLabel: Immutable.Map(),
      curMemo: Immutable.Map(),
    }
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <LabelList className={styles.labelList} />
        <MemoList className={styles.memoList} />
        <MemoEditor className={styles.memoEditor} />
      </div>
    )
  }
}

export default App