/* External Dependencies */
import React from 'react'
import classNames from 'classnames'
import { withRouter } from 'react-router'
import Immutable from 'immutable'
import NotificationSystem from 'react-notification-system'

/* Internal Dependencies */
import styles from './App.scss'
import Store from './Store'
import RoutingComponent from '../lib'
import LabelList from '../LabelList'
import MemoEditor from '../MemoEditor'
import MemoList from '../MemoList'

const toastWidth = 540
const toastStyle = {
  Containers: {
    DefaultStyle: {
      width: toastWidth,
    },
    tc: {
      marginLeft: -(toastWidth / 2),
    },
  },
  NotificationItem: {
    DefaultStyle: {
      borderTop: '0',
      fontWeight: 'bold',
      textAlign: 'center',
      borderRadius: '3px',
    },
    error: {
      backgroundColor: '#FFB000', // yellow
      color: '#11191C', // black
    },
  },
  Dismiss: {
    DefaultStyle: {
      position: 'absolute',
      top: '11px',
      backgroundColor: 'transparent',
    },
    error: {
      color: '#11191C', // black
    },
  },
}

@withRouter
class App extends RoutingComponent {
  constructor() {
    super()
    this.changeTab = this.changeTab.bind(this)
    Object.keys(Store).forEach(method => {
      this[method] = Store[method].bind(this)
    })
    this.showError = error => {
      this._refs.notificationSystem.addNotification({
        level: 'error',
        message: error.body.errorMessage,
        position: 'tc',
        autoDismiss: 3,
      })
    }

    this._refs = {}
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
    const getLabels = this.getLabels()
    const getMemos = this.getMemos()

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
        <NotificationSystem
          ref={c => { if (c) { this._refs.notificationSystem = c } }}
          style={toastStyle} />
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
        <div className={styles.mainTab}>
          <div className={styles.header}>
            <div
              className={classNames(styles.adjustTab, styles.item)}
              onClick={this.changeTab}>
              {
                this.state.tab > 1 ?
                  '탭 접기' :
                  '탭 펼치기'
              }
            </div>
            <div
              className={classNames(styles.deleteMemo, styles.item)}>
              English
            </div>
            <div
              className={classNames(styles.changeLabel, styles.item)}>
              검색
            </div>
          </div>
          <MemoEditor
            className={styles.memoEditor}
            memo={this.getCurrentMemo()}
            labels={this.state.labels}
            labelList={labelList}
            updateMemo={this.updateMemo}
            deleteMemo={this.deleteMemo} />
        </div>
      </div>
    )
  }
}

export default App