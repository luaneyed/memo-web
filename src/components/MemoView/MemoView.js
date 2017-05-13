/* External Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './MemoView.scss'
import MemoEditor from './MemoEditor'
import SelectLabelModal from './SelectLabelModal'

class MemoView extends React.Component {
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

  isMemoSelected() {
    return !this.props.memo.isEmpty()
  }

  onClickDeleteLabel() {
    if (this.isMemoSelected()) {
      this.props.deleteMemo(this.props.memo.get('_id'))
    }
  }

  onClickSelectLabel() {
    if (this.isMemoSelected()) {
      this.setState({
        showSelectLabelModal: true,
      })
    }
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
    return (
      <div className={classNames(styles.wrapper, this.props.className)}>
        <div className={styles.header}>
          <div
            className={classNames(styles.adjustTab, styles.item)}
            onClick={this.props.changeTab}>
            {
              this.props.tab > 1 ?
                '탭 접기' :
                '탭 펼치기'
            }
          </div>
          <div
            className={classNames(styles.deleteMemo, styles.item, { [styles.disabled]: !this.isMemoSelected() })}
            onClick={this.onClickDeleteLabel}>
            메모 삭제
          </div>
          <div
            className={classNames(styles.changeLabel, styles.item, { [styles.disabled]: !this.isMemoSelected() })}
            onClick={this.onClickSelectLabel}>
            라벨 변경
          </div>
        </div>
        <MemoEditor
          className={styles.memoEditor}
          memo={this.props.memo}
          updateMemo={this.props.updateMemo} />
        <SelectLabelModal
          show={this.state.showSelectLabelModal}
          labels={this.props.labels}
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

MemoView.propTypes = {
  className: PropTypes.string,
  tab: PropTypes.number,
  changeTab: PropTypes.func,
  memo: PropTypes.instanceOf(Immutable.Map),
  labels: PropTypes.instanceOf(Immutable.List),
  updateMemo: PropTypes.func,
  deleteMemo: PropTypes.func,
}

MemoView.defaultProps = {
  className: '',
  tab: 3,
  changeTab: () => {},
  memo: Immutable.Map(),
  labels: Immutable.List(),
  updateMemo: () => {},
  deleteMemo: () => {},
}

export default MemoView