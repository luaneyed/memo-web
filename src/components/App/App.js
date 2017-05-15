/* External Dependencies */
import React from 'react'
import classNames from 'classnames'
import { withRouter } from 'react-router'
import Immutable from 'immutable'
import NotificationSystem from 'react-notification-system'
import { LocalStorage } from 'awesome-domstorage'

/* Internal Dependencies */
import styles from './App.scss'
import Store from './Store'
import RoutingComponent from '../lib'
import LabelList from '../LabelList'
import MemoEditor from '../MemoEditor'
import MemoList from '../MemoList'
import MemoManager from '../MemoManager'
import { translations } from '../../constants'

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
    this.toggleMemoSelecting = this.toggleMemoSelecting.bind(this)
    this.toggleSelectMemoId = this.toggleSelectMemoId.bind(this)
    this.attachLabelsToSelectedMemos = this.attachLabelsToSelectedMemos.bind(this)
    this.detachLabelsToSelectedMemos = this.detachLabelsToSelectedMemos.bind(this)
    this.deleteSelectedMemos = this.deleteSelectedMemos.bind(this)
    this.selectAllMemos = this.selectAllMemos.bind(this)
    this.deselectAllMemos = this.deselectAllMemos.bind(this)
    this.changeLanguage = this.changeLanguage.bind(this)
    this.translate = this.translate.bind(this)
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

      //  app data
      selectedMemoIds: Immutable.Set(),

      //  UI
      isLoading: true,
      tab: 3,
      language: LocalStorage.get('LANGUAGE'),
      isMemoListSelecting: false,
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

  changeLanguage() {
    this.setState(({ language }) => {
      const newLang = language === 'ko' ? 'en' : 'ko'
      LocalStorage.set('LANGUAGE', newLang)
      return {
        language: newLang
      }
    })
  }

  toggleMemoSelecting() {
    this.setState(({ isMemoListSelecting }) => {
      const newState = {
        isMemoListSelecting: !isMemoListSelecting
      }
      if (isMemoListSelecting) {
        newState.selectedMemoIds = Immutable.Set()
      }
      return newState
    })
  }

  toggleSelectMemoId(memoId) {
    this.setState(({ selectedMemoIds }) => ({
      selectedMemoIds: selectedMemoIds[selectedMemoIds.has(memoId) ? 'remove' : 'add'](memoId)
    }))
  }

  attachLabelsToSelectedMemos(labelIds) {
    this.attachLabels(this.state.selectedMemoIds, labelIds)
      .then(() => {
        this.setState({
          isMemoListSelecting: false,
        })
      })
  }

  detachLabelsToSelectedMemos(labelIds) {
    this.detachLabels(this.state.selectedMemoIds, labelIds)
      .then(() => {
        this.setState({
          isMemoListSelecting: false,
        })
      })
  }

  deleteSelectedMemos() {
    this.deleteMemos(this.state.selectedMemoIds)
      .then(() => {
        this.setState({
          selectedMemoIds: Immutable.Set(),
          isMemoListSelecting: false,
        })
      })
  }

  selectAllMemos() {
    this.setState(({ memos }) => ({
      selectedMemoIds: Immutable.Set(memos.keys())
    }))
  }

  deselectAllMemos() {
    this.setState({
      selectedMemoIds: Immutable.Set(),
    })
  }

  translate(key) {
    return translations[this.state.language][key]
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.loader}>
            {this.translate('loading')}
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
              createLabel={this.createLabel}
              translate={this.translate} />) :
            null
        }
        {
          this.state.tab >= 2 ?
            (<MemoList
              className={styles.memoList}
              currentLabel={this.getCurrentLabel()}
              memos={memoList}
              selecting={this.state.isMemoListSelecting}
              toggleSelecting={this.toggleMemoSelecting}
              toggleSelectMemoId={this.toggleSelectMemoId}
              selectedMemoIds={this.state.selectedMemoIds}
              updateLabel={this.updateLabel}
              deleteLabel={this.deleteLabel}
              createMemo={this.createMemo}
              translate={this.translate} />) :
            null
        }
        <div className={styles.mainTab}>
          <div className={styles.header}>
            <div
              className={classNames(styles.adjustTab, styles.item)}
              onClick={this.changeTab}>
              {
                this.state.tab > 1 ?
                  this.translate('fold_tab'):
                  this.translate('unfold_tab')
              }
            </div>
            <div
              className={classNames(styles.deleteMemo, styles.item)}
              onClick={this.changeLanguage}>
              {
                this.state.language === 'ko' ?
                  "English" :
                  "한국어"
              }
            </div>
            <div
              className={classNames(styles.changeLabel, styles.item)}>
              {this.translate('search')}
            </div>
          </div>
          {
            this.state.isMemoListSelecting ?
              (<MemoManager
                className={styles.memoManager}
                translate={this.translate}
                labelList={labelList}
                attachLabelsToSelectedMemos={this.attachLabelsToSelectedMemos}
                detachLabelsToSelectedMemos={this.detachLabelsToSelectedMemos}
                deleteSelectedMemos={this.deleteSelectedMemos}
                selectAllMemos={this.selectAllMemos}
                deselectAllMemos={this.deselectAllMemos} />) :
              (<MemoEditor
                className={styles.memoEditor}
                memo={this.getCurrentMemo()}
                labels={this.state.labels}
                labelList={labelList}
                updateMemo={this.updateMemo}
                deleteMemo={this.deleteMemo}
                translate={this.translate} />)
          }
        </div>
      </div>
    )
  }
}

export default App