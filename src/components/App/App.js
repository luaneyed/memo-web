/* External Dependencies */
import React from 'react'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './App.scss'
import LabelList from '../LabelList'
import MemoEditor from '../MemoEditor'
import MemoList from '../MemoList'
import { LabelAPI, MemoAPI } from '../../api'

class App extends React.Component {
  constructor() {
    super()
    this.createLabel = this.createLabel.bind(this)
    this.state = {
      //  pure states
      labels: Immutable.List(),
      memos: Immutable.List(),
      curLabel: Immutable.Map(),
      curMemo: Immutable.Map(),

      //  combined states
      combinedLabels: Immutable.List(),
    }
  }

  componentWillMount() {
    LabelAPI.getList()
      .then(res => {
        this.setState({
          labels: Immutable.fromJS(res)
        })
      })
    MemoAPI.getList()
      .then(res => {
        this.setState({
          memos: Immutable.fromJS(res)
        })
      })
  }

  componentWillUpdate(nextProps, nextState) {
    if (!nextState.labels.equals(this.state.labels) || !nextState.memos.equals(this.state.memos)) {
      let combinedLabels = nextState.labels.map(label => label.set('memoCount', 0))
      combinedLabels = combinedLabels.push(Immutable.Map({
        _id: 'all',
        name: '전체메모',
        memoCount: nextState.memos.size,
        createdAt: 0,
      }))
      // nextState.memos.forEach(memo => {
      //   console.log('memo', memo)
      // })
      combinedLabels = combinedLabels.sort(
        (label1, label2) => (label1.get('createdAt') > label2.get('createdAt') ? 1 : -1)
      )
      this.setState({ combinedLabels })
    }
  }

  createLabel(name) {
    LabelAPI.create({ name })
      .then(label => {
        this.setState(state => ({
          labels: state.labels.push(Immutable.Map(label))
        }))
      })
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <LabelList
          className={styles.labelList}
          labels={this.state.combinedLabels}
          createLabel={this.createLabel} />
        <MemoList className={styles.memoList} />
        <MemoEditor className={styles.memoEditor} />
      </div>
    )
  }
}

export default App