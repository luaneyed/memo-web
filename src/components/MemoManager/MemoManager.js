/* External Dependencies */
import React from 'react'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import classNames from 'classnames'

/* Internal Dependencies */
import styles from './MemoManager.scss'
import SelectLabelModal from '../SelectLabelModal'

class MemoManager extends React.Component {
  constructor() {
    super()
    this.onClickAttachLabels = this.onClickAttachLabels.bind(this)
    this.onClickDetachLabels = this.onClickDetachLabels.bind(this)
    this.onHideSelectLabelModal = this.onHideSelectLabelModal.bind(this)
    this.onSubmitSelectLabelModal = this.onSubmitSelectLabelModal.bind(this)
    this.state = {
      showSelectLabelModal: false,
      isAttaching: true,
    }
  }

  onClickAttachLabels() {
    this.setState({
      showSelectLabelModal: true,
      isAttaching: true,
    })
  }

  onClickDetachLabels() {
    this.setState({
      showSelectLabelModal: true,
      isAttaching: false,
    })
  }

  onHideSelectLabelModal() {
    this.setState({
      showSelectLabelModal: false,
    })
  }

  onSubmitSelectLabelModal(labelIds) {
    this.setState({
      showSelectLabelModal: false,
    })
    this.props[this.state.isAttaching ? 'attachLabelsToSelectedMemos' : 'detachLabelsToSelectedMemos'](labelIds)
  }

  render() {
    const { className, translate, deleteSelectedMemos, selectAllMemos, deselectAllMemos } = this.props
    return (
      <div className={classNames(styles.wrapper, className)}>
        <div className={styles.buttons}>
          <div className={styles.attachLabels} onClick={this.onClickAttachLabels}>
            {translate('attach_label')}
          </div>
          <div className={styles.detachLabels} onClick={this.onClickDetachLabels}>
            {translate('detach_label')}
          </div>
          <div className={styles.deleteMemos} onClick={deleteSelectedMemos}>
            {translate('delete_memos')}
          </div>
          <div className={styles.selectAll} onClick={selectAllMemos}>
            {translate('select_all_memos')}
          </div>
          <div className={styles.deselectAll} onClick={deselectAllMemos}>
            {translate('deselect_all_memos')}
          </div>
        </div>
        <SelectLabelModal
          selectedClassName={this.state.isAttaching ? undefined : styles.selectedDeletingLabel}
          show={this.state.showSelectLabelModal}
          title={this.props.translate(this.state.isAttaching ? 'select_labels_to_attach' : 'select_labels_to_detach')}
          labelList={this.props.labelList}
          onCancel={this.onHideSelectLabelModal}
          onSubmit={this.onSubmitSelectLabelModal}
          ok={this.props.translate('select')}
          cancel={this.props.translate('cancel')} />
      </div>
    )
  }
}

MemoManager.propTypes = {
  className: PropTypes.string,
  translate: PropTypes.func,
  labelList: PropTypes.instanceOf(Immutable.List),
  attachLabelsToSelectedMemos: PropTypes.func,
  detachLabelsToSelectedMemos: PropTypes.func,
  deleteSelectedMemos: PropTypes.func,
  selectAllMemos: PropTypes.func,
  deselectAllMemos: PropTypes.func,
}

MemoManager.defaultProps = {
  className: '',
  translate: () => {},
  labelList: Immutable.List(),
  attachLabelsToSelectedMemos: () => {},
  detachLabelsToSelectedMemos: () => {},
  deleteSelectedMemos: () => {},
  selectAllMemos: () => {},
  deselectAllMemos: () => {},
}

export default MemoManager
