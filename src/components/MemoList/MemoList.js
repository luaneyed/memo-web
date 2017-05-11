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



  render() {
    const { className, memos } = this.props
    return (
      <div className={classNames(styles.wrapper, className)}>
        <div className={styles.header}>
          <div
            className={classNames(styles.createMemo, styles.item)}>
            메모 추가
          </div>
          <div
            className={classNames(styles.startSelection, styles.item)}>
            다중 선택
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
                    이름 변경
                  </div>
                  <div
                    className={styles.delete}
                    onClick={() => { this.props.deleteLabel(this.props.currentLabel) }}>
                    삭제
                  </div>
                </div>)
            }
          </div>
          {memos.map(memo =>
            <MemoPreview
              key={memo.get('_id')}
              className={classNames(styles.memoPreview, styles.item)}
              memo={memo}
              onClick={() => { this.setCurrentMemo(memo) }} />
          )}
        </div>
        <EditModal
          show={this.state.showEditLabelModal}
          value={this.props.currentLabel.get('name')}
          onCancel={this.onHideEditLabelModal}
          onSubmit={this.onSubmitEditLabelModal}
          title="라벨 이름"
          ok="변경"
          cancel="취소" />
      </div>
    )
  }
}

MemoList.propTypes = {
  className: PropTypes.string,
  currentLabel: PropTypes.instanceOf(Immutable.Map),
  memos: PropTypes.instanceOf(Immutable.List),
  updateLabel: PropTypes.func,
  deleteLabel: PropTypes.func,
}

MemoList.defaultProps = {
  className: '',
  currentLabel: Immutable.Map(),
  memos: Immutable.List(),
  updateLabel: () => {},
  deleteLabel: () => {},
}

export default MemoList