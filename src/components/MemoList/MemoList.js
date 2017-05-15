/* External Dependencies */
import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './MemoList.scss'
import MemoPreview from './MemoPreview'
import RoutingComponent from '../lib'
import EditModal from '../EditModal'

@withRouter
class MemoList extends RoutingComponent {
  constructor() {
    super()
    this.onClickEditLabel = this.onClickEditLabel.bind(this)
    this.onHideEditLabelModal = this.onHideEditLabelModal.bind(this)
    this.onSubmitEditLabelModal = this.onSubmitEditLabelModal.bind(this)
    this.onClickMemo = this.onClickMemo.bind(this)
    this.state = {
      showEditLabelModal: false,
    }
  }

  onClickEditLabel() {
    this.setState({
      showEditLabelModal: true,
    })
  }

  onHideEditLabelModal() {
    this.setState({
      showEditLabelModal: false,
    })
  }

  onSubmitEditLabelModal(labelName) {
    this.setState({
      showEditLabelModal: false,
    })
    this.props.updateLabel(this.props.currentLabel.set('name', labelName))
  }

  onClickMemo(memo) {
    if (this.props.selecting) {
      this.props.toggleSelectMemoId(memo.get('_id'))
    } else {
      this.setCurrentMemo(memo)
    }
  }

  renderMemoPreview(memo, currentMemoId) {
    const memoId = memo.get('_id')
    const preview = (
      <MemoPreview
        key={memoId}
        className={classNames(styles.memoPreview, {
          [styles.viewing]: !this.props.selecting && memoId === currentMemoId,
          [styles.selected]: this.props.selectedMemoIds.has(memoId),
        })}
        memo={memo}
        onClick={() => { this.onClickMemo(memo) }} />
    )
    return preview
  }

  render() {
    const { className, memos } = this.props
    const currentMemoId = this.getCurrentMemoId()
    return (
      <div className={classNames(styles.wrapper, className)}>
        <div className={styles.header}>
          <div
            className={classNames(styles.createMemo, styles.item)}
            onClick={this.props.createMemo}>
            {this.props.translate('create_memo')}
          </div>
          <div
            className={classNames(styles.startSelection, styles.item)}
            onClick={this.props.toggleSelecting}>
            {this.props.translate(this.props.selecting ? 'cancel' : 'select_memos')}
          </div>
        </div>
        <div className={styles.list}>
          <div className={styles.labelInfo}>
            <div className={styles.name}>
              {this.props.currentLabel.get('name')}
            </div>
            {
              this.getCurrentLabelId() === 'all' ?
                null :
                (<div className={styles.functions}>
                  <div className={styles.editName} onClick={this.onClickEditLabel}>
                    {this.props.translate('edit_label_name')}
                  </div>
                  <div
                    className={styles.delete}
                    onClick={() => { this.props.deleteLabel(this.props.currentLabel) }}>
                    {this.props.translate('remove')}
                  </div>
                </div>)
            }
          </div>
          {
            memos.size > 0 ?
              memos.map(memo => this.renderMemoPreview(memo, currentMemoId)) :
              <div className={styles.noMemo}>{this.props.translate('no_memo')}</div>
          }
        </div>
        <EditModal
          show={this.state.showEditLabelModal}
          value={this.props.currentLabel.get('name')}
          onCancel={this.onHideEditLabelModal}
          onSubmit={this.onSubmitEditLabelModal}
          title={this.props.translate('label_name')}
          ok={this.props.translate('save')}
          cancel={this.props.translate('cancel')} />
      </div>
    )
  }
}

MemoList.propTypes = {
  className: PropTypes.string,
  currentLabel: PropTypes.instanceOf(Immutable.Map),
  memos: PropTypes.instanceOf(Immutable.List),
  selecting: PropTypes.bool,
  toggleSelecting: PropTypes.func,
  toggleSelectMemoId: PropTypes.func,
  selectedMemoIds: PropTypes.instanceOf(Immutable.Set),
  updateLabel: PropTypes.func,
  deleteLabel: PropTypes.func,
  createMemo: PropTypes.func,
  translate: PropTypes.func.isRequired,
}

MemoList.defaultProps = {
  className: '',
  currentLabel: Immutable.Map(),
  memos: Immutable.List(),
  selecting: false,
  toggleSelecting: () => {},
  toggleSelectMemoId: () => {},
  selectedMemoIds: Immutable.Set(),
  updateLabel: () => {},
  deleteLabel: () => {},
  createMemo: () => {},
}

export default MemoList
