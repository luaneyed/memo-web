/* External Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withRouter } from 'react-router'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './MemoEditor.scss'
import Transformer from './Transformer'
import SelectLabelModal from './SelectLabelModal'
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
          placeholder="제목을 입력해주세요"
          onChange={newTitle => { this.props.updateMemo(this.props.memo.set('title', newTitle)) }} />
        <div className={styles.buttons}>
          <div
            className={classNames(styles.selectLabel, styles.item)}
            onClick={this.onClickSelectLabel}>
            라벨 선택
          </div>
          <div
            className={classNames(styles.deleteMemo, styles.item)}
            onClick={this.onClickDeleteLabel}>
            메모 삭제
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
          placeholder="여기를 클릭하여 메모를 작성하세요"
          onChange={newContent => { this.props.updateMemo(this.props.memo.set('content', newContent)) }} />
        <SelectLabelModal
          show={this.state.showSelectLabelModal}
          labelList={this.props.labelList}
          selectedLabelIds={this.props.memo.get('labelIds')}
          onCancel={this.onHideSelectLabelModal}
          onSubmit={this.onSubmitSelectLabelModal}
          title="라벨 이름"
          ok="변경"
          cancel="취소" />
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