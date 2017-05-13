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

const listToSet = list => Immutable.Set().withMutations(
  immutable => {
    list.forEach(elem => {
      immutable.add(elem)
    })
  })

const convertMemosToImmutable = memos =>
  listToMap(memos).map(memo => memo.set('labelIds', listToSet(memo.get('labelIds'))))

const convertMemoToImmutable = memo => {
  const labelIds = memo.labelIds
  if (labelIds) {
    memo.labelIds = listToSet(labelIds)
  }
  return Immutable.Map(memo)
}

const convertMemoToObject = memo => memo.set('labelIds', memo.get('labelIds').toArray()).toObject()

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
        this.setState({ labels: listToMap(res) }, this.validateSearchQuery)
      })
    const getMemos = MemoAPI.getList()
      .then(res => {
        this.setState({
          memos: convertMemosToImmutable(res)
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
    this.validateSearchQuery(nextProps)
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.isLoading && !nextState.isLoading) {
      this.validateSearchQuery(nextProps, nextState)
    }

    if (!nextState.labels.equals(this.state.labels) || !nextState.memos.equals(this.state.memos)) {
      this.setState({
        countedLabels : nextState.labels
          .map(label => label.set('memoCount', 0))
          .set('all', Immutable.Map({
            _id: 'all',
            name: '전체메모',
            memoCount: nextState.memos.size,
            createdAt: 0,
          }))
          .withMutations(labels => {
            nextState.memos.forEach(memo => {
              memo.get('labelIds').forEach(labelId => {
                labels.set(labelId, labels.get(labelId).set('memoCount', labels.getIn([labelId, 'memoCount']) + 1))
              })
            })
          })
      })
    }
  }

  componentDidUpdate() {
    this.autoSelectMemo()
  }

  validateSearchQuery(props = this.props, state = this.state) {
    const currentLabelId = this.getCurrentLabelId(props)
    if (!currentLabelId || !state.labels.get(currentLabelId)) {
      this.replaceCurrentLabelId('all', props)
    }

    const currentMemoId = this.getCurrentMemoId(props)
    if (currentMemoId === '') {
      this.removeCurrentMemoId(props)
    }

    if (!state.isLoading && currentMemoId) {
      if (!state.memos.get(currentMemoId)) {
        this.removeCurrentMemoId(props)
      }
    }
  }

  autoSelectMemo(props = this.props, state = this.state) {
    if (!this.getCurrentMemoId(props)) {
      const memos = this.getMemoList(state)
      if (memos.size > 0) {
        this.replaceCurrentMemoId(memos.first().get('_id'))
      }
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
          labels: state.labels.set(label._id, convertMemoToImmutable(label))
        }))
      })
  }

  deleteLabel(label) {
    const labelId = label.get('_id')
    if (labelId && labelId !== 'all') {
      LabelAPI.remove(labelId)
        .then(memos => {
          const newMemos = convertMemosToImmutable(memos)
          this.setState(state => ({
            labels: state.labels.remove(labelId),
            memos: state.memos.withMutations(prevMemos => {
              newMemos.forEach(newMemo => {
                prevMemos.set(newMemo.get('_id'),newMemo)
              })
            }),
          }))
          this.removeCurrentLabelId()
        })
    }
  }

  createMemo() {
    const currentLabelId = this.getCurrentLabelId()
    const labelIds = currentLabelId === 'all' ? [] : [currentLabelId]
    MemoAPI.create({
      title: '새 메모',
      content: '내용을 입력해주세요.',
      labelIds,
    })
      .then(memo => {
        this.setState(state => ({
          memos: state.memos.set(memo._id, convertMemoToImmutable(memo))
        }))
      })
  }

  updateMemo(memo) {
    MemoAPI.update(memo.get('_id'), convertMemoToObject(memo))
      .then(updatedMemo => {
        this.setState(state => ({
          memos: state.memos.set(updatedMemo._id, convertMemoToImmutable(updatedMemo))
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

  getLabelList(state = this.state) {
    return state.countedLabels.toList().sort(
      (label1, label2) => {
        if (label1.get('_id') === 'all')
          return -1
        if (label2.get('_id') === 'all')
          return 1
        return  (label1.get('createdAt') < label2.get('createdAt') ? 1 : -1)
      }
    )
  }

  getMemoList(state = this.state) {
    const currentLabelId = this.getCurrentLabelId()
    return state.memos
      .filter(memo => currentLabelId === 'all' || memo.get('labelIds').has(currentLabelId))
      .toList()
      .sort((label1, label2) => (label1.get('updatedAt') < label2.get('updatedAt') ? 1 : -1))
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
    const labelList = this.getLabelList()
    const memoList = this.getMemoList()
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
          labels={labelList}
          updateMemo={this.updateMemo}
          deleteMemo={this.deleteMemo} />
      </div>
    )
  }
}

export default App