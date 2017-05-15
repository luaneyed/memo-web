/* External Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withRouter } from 'react-router'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './MemoEditor.scss'
import Transformer from './Transformer'
import SelectLabelModal from '../SelectLabelModal'
import RoutingComponent from '../lib'
import { displayTime } from '../../utils/momentUtils'

@withRouter
class MemoEditor extends RoutingComponent {
  constructor() {
    super()
    this.onClickDeleteLabel = this.onClickDeleteLabel.bind(this)
    this.onClickSelectLabel = this.onClickSelectLabel.bind(this)
    this.onHideSelectLabelModal = this.onHideSelectLabelModal.bind(this)
    this.onSubmitSelectLabelModal = this.onSubmitSelectLabelModal.bind(this)
    this.state = {
      showSelectLabelModal: false,
    }
  }

  onClickDeleteLabel() {
    this.props.deleteMemo(this.props.memo.get('_id'))
  }

  onClickSelectLabel() {
    this.setState({
      showSelectLabelModal: true,
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
    this.props.updateMemo(this.props.memo.set('labelIds', labelIds))
  }

  render() {
    const { className, memo } = this.props
    if (memo.isEmpty()) {
      return null
    }
    return (
      <div className={classNames(styles.wrapper, className)}>
        <Transformer
          className={styles.title}
          fontClassName={styles.titleFont}
          value={memo.get('title')}
          placeholder={this.props.translate('enter_title')}
          onChange={newTitle => { this.props.updateMemo(this.props.memo.set('title', newTitle)) }} />
        <div className={styles.buttons}>
          <div
            className={classNames(styles.selectLabel, styles.item)}
            onClick={this.onClickSelectLabel}>
            {this.props.translate('select_labels')}
          </div>
          <div
            className={classNames(styles.deleteMemo, styles.item)}
            onClick={this.onClickDeleteLabel}>
            {this.props.translate('delete_memo')}
          </div>
        </div>
        <div className={styles.labels}>
          {this.props.memo.get('labelIds').map(labelId => (
            <span key={labelId} className={styles.label} onClick={() => { this.setCurrentLabelId(labelId) }}>
              {this.props.labels.get(labelId).get('name')}
            </span>
          ))}
        </div>
        <div className={styles.updatedAt}>{displayTime(memo.get('updatedAt'))}</div>
        <Transformer
          fontClassName={styles.contentFont}
          value={memo.get('content')}
          placeholder={this.props.translate('enter_content')}
          onChange={newContent => { this.props.updateMemo(this.props.memo.set('content', newContent)) }} />
        <SelectLabelModal
          show={this.state.showSelectLabelModal}
          title={this.props.translate('select_labels')}
          labelList={this.props.labelList}
          selectedLabelIds={this.props.memo.get('labelIds')}
          onCancel={this.onHideSelectLabelModal}
          onSubmit={this.onSubmitSelectLabelModal}
          ok={this.props.translate('save')}
          cancel={this.props.translate('cancel')} />
      </div>
    )
  }
}

MemoEditor.propTypes = {
  className: PropTypes.string,
  memo: PropTypes.instanceOf(Immutable.Map),
  labels: PropTypes.instanceOf(Immutable.Map),
  labelList: PropTypes.instanceOf(Immutable.List),
  updateMemo: PropTypes.func,
  deleteMemo: PropTypes.func,
  translate: PropTypes.func.isRequired,
}

MemoEditor.defaultProps = {
  className: '',
  memo: Immutable.Map(),
  labels: Immutable.Map(),
  labelList: Immutable.List(),
  updateMemo: () => {},
  deleteMemo: () => {},
}

export default MemoEditor