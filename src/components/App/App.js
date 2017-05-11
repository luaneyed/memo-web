/* External Dependencies */
import React from 'react'
import { withRouter } from 'react-router'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './App.scss'
import RoutingComponent from '../lib'
import LabelList from '../LabelList'
import MemoView from '../MemoView'
import MemoList from '../MemoList'
import { LabelAPI, MemoAPI } from '../../api'

const listToMap = list => Immutable.Map().withMutations(
  immutable => {
    list.forEach(elem => {
      immutable.set(elem._id, Immutable.Map(elem))
    })
  })

@withRouter
class App extends RoutingComponent {
  constructor() {
    super()
    this.createLabel = this.createLabel.bind(this)
    this.updateLabel = this.updateLabel.bind(this)
    this.deleteLabel = this.deleteLabel.bind(this)
    this.state = {
      //  pure states
      labels: Immutable.Map(),
      memos: Immutable.Map(),

      //  combined states
      countedLabels: Immutable.Map(),
    }
  }

  componentWillMount() {
    LabelAPI.getList()
      .then(res => {
        this.setState({ labels: listToMap(res) }, () => {
          if (!this.getCurrentLabelId()) {
            this.setCurrentLabelId('all')
          }
        })
      })
    MemoAPI.getList()
      .then(res => {
        this.setState({
          memos: listToMap(res)
        })
      })
  }

  componentWillUpdate(nextProps, nextState) {
    if (!nextState.labels.equals(this.state.labels) || !nextState.memos.equals(this.state.memos)) {
      let countedLabels = nextState.labels.map(label => label.set('memoCount', 0))
      countedLabels = countedLabels.set('all', Immutable.Map({
        _id: 'all',
        name: '전체메모',
        memoCount: nextState.memos.size,
        createdAt: 0,
      }))
      // nextState.memos.forEach(memo => {
      //   console.log('memo', memo)
      // })]
      this.setState({ countedLabels })
    }
  }

  getCurrentLabel() {
    const currentLabelId = this.getCurrentLabelId()
    return this.state.countedLabels.find(label => label.get('_id') === currentLabelId, undefined, Immutable.Map())
  }

  getCurrentMemo() {
    const currentMemoId = this.getCurrentMemoId()
    this.state.memos.find(memo => memo.get('_id') === currentMemoId, undefined, Immutable.Map())
  }

  createLabel(name) {
    LabelAPI.create({ name })
      .then(label => {
        this.setState(state => ({
          labels: state.labels.set(label._id, Immutable.Map(label))
        }))
      })
  }

  updateLabel(label) {
    LabelAPI.update(label.get('_id'), label.toObject())
      .then(label => {
        this.setState(state => ({
          labels: state.labels.set(label._id, Immutable.Map(label))
        }))
      })
  }

  deleteLabel(label) {
    const labelId = label.get('_id')
    if (labelId && labelId !== 'all') {
      LabelAPI.remove(labelId)
        .then(() => {
          this.setState(state => ({
            labels: state.labels.remove(labelId)
          }))
          this.setCurrentLabelId('all')
        })
    }
  }

  render() {
    const labelList = this.state.countedLabels.toList().sort(
      (label1, label2) => {
        if (label1.get('_id') === 'all')
          return -1
        if (label2.get('_id') === 'all')
          return 1
        return  (label1.get('createdAt') < label2.get('createdAt') ? 1 : -1)
      }
    )
    const memoList = this.state.memos.toList()
    return (
      <div className={styles.wrapper}>
        <LabelList
          className={styles.labelList}
          labels={labelList}
          createLabel={this.createLabel} />
        <MemoList
          className={styles.memoList}
          currentLabel={this.getCurrentLabel()}
          memos={memoList}
          updateLabel={this.updateLabel}
          deleteLabel={this.deleteLabel} />
        <MemoView className={styles.memoEditor} />
      </div>
    )
  }
}

export default App