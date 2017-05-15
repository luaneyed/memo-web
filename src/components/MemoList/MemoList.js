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
            className={classNames(styles.startSelection, styles.item)}>
            {this.props.translate('select_memos')}
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
              memos.map(memo =>
                <MemoPreview
                  key={memo.get('_id')}
                  className={styles.memoPreview}
                  memo={memo}
                  selected={memo.get('_id') === currentMemoId}
                  onClick={() => { this.setCurrentMemo(memo) }} />
              ) :
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
  updateLabel: PropTypes.func,
  deleteLabel: PropTypes.func,
  createMemo: PropTypes.func,
  translate: PropTypes.func.isRequired,
}

MemoList.defaultProps = {
  className: '',
  currentLabel: Immutable.Map(),
  memos: Immutable.List(),
  updateLabel: () => {},
  deleteLabel: () => {},
  createMemo: () => {},
}

export default MemoList