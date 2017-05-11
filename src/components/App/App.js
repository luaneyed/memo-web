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
    this.changeTab = this.changeTab.bind(this)
    this.createLabel = this.createLabel.bind(this)
    this.updateLabel = this.updateLabel.bind(this)
    this.deleteLabel = this.deleteLabel.bind(this)
    this.createMemo = this.createMemo.bind(this)
    this.updateMemo = this.updateMemo.bind(this)
    this.deleteMemo = this.deleteMemo.bind(this)
    this.state = {
      //  pure data
      labels: Immutable.Map(),
      memos: Immutable.Map(),

      //  combined data
      countedLabels: Immutable.Map(),

      //  UI
      isLoading: true,
      tab: 3,
    }
  }

  componentWillMount() {
    const getLabels = LabelAPI.getList()
      .then(res => {
        this.setState({ labels: listToMap(res) }, () => {
          if (!this.getCurrentLabelId()) {
            this.setCurrentLabelId('all')
          }
        })
      })
    const getMemos = MemoAPI.getList()
      .then(res => {
        this.setState({
          memos: listToMap(res)
        })
      })

    Promise.all([getLabels, getMemos])
      .then(() => {
        this.setState({
          isLoading: false
        })
      })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.getCurrentLabelId(nextProps)) {
      this.setCurrentLabelId('all', nextProps)
    }
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

  changeTab() {
    this.setState(state => {
      const { tab } = state
      return { tab: ((tab > 1) ? (tab - 1) : 3) }
    })
  }

  getCurrentLabel() {
    return this.state.countedLabels.get(this.getCurrentLabelId()) || Immutable.Map()
  }

  getCurrentMemo() {
    return this.state.memos.get(this.getCurrentMemoId()) || Immutable.Map()
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
          this.removeCurrentLabelId()
        })
    }
  }

  createMemo() {
    MemoAPI.create({
      title: '새 메모',
      content: '내용을 입력해주세요.',
    })
      .then(memo => {
        this.setState(state => ({
          memos: state.memos.set(memo._id, Immutable.Map(memo))
        }))
      })
  }

  updateMemo(memo) {
    MemoAPI.update(memo.get('_id'), memo.toObject())
      .then(updatedMemo => {
        this.setState(state => ({
          memos: state.memos.set(updatedMemo._id, Immutable.Map(updatedMemo))
        }))
      })
  }

  deleteMemo(memoId) {
    MemoAPI.remove(memoId)
      .then(() => {
        this.setState(state => ({
          memos: state.memos.remove(memoId)
        }))
        this.removeCurrentMemoId()
      })
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.loader}>
            로딩중입니다...
          </div>
        </div>
      )
    }
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
        {
          this.state.tab === 3 ?
            (<LabelList
              className={styles.labelList}
              labels={labelList}
              createLabel={this.createLabel} />) :
            null
        }
        {
          this.state.tab >= 2 ?
            (<MemoList
              className={styles.memoList}
              currentLabel={this.getCurrentLabel()}
              memos={memoList}
              updateLabel={this.updateLabel}
              deleteLabel={this.deleteLabel}
              createMemo={this.createMemo} />) :
            null
        }
        <MemoView
          className={styles.memoEditor}
          tab={this.state.tab}
          changeTab={this.changeTab}
          memo={this.getCurrentMemo()}
          updateMemo={this.updateMemo}
          deleteMemo={this.deleteMemo} />
      </div>
    )
  }
}

export default App