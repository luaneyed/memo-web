/* External Dependencies */
import React from 'react'
// import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './MemoView.scss'
import MemoEditor from './MemoEditor'
// import RoutingComponent from '../lib'
import EditModal from '../EditModal'

// @withRouter
class MemoView extends React.Component {
  constructor() {
    super()
    // this.onClickEditLabel = this.onClickEditLabel.bind(this)
    // this.onHideEditLabelModal = this.onHideEditLabelModal.bind(this)
    // this.onSubmitEditLabelModal = this.onSubmitEditLabelModal.bind(this)
    this.state = {
      // showEditLabelModal: false,
    }
  }

  // onClickEditLabel() {
  //   this.setState({
  //     showEditLabelModal: true,
  //   })
  // }
  //
  // onHideEditLabelModal() {
  //   this.setState({
  //     showEditLabelModal: false,
  //   })
  // }
  //
  // onSubmitEditLabelModal(labelName) {
  //   this.setState({
  //     showEditLabelModal: false,
  //   })
  //   this.props.updateLabel(this.props.currentLabel.set('name', labelName))
  // }

  render() {
    const { className, memos } = this.props
    return (
      <div className={classNames(styles.wrapper, className)}>
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
            className={classNames(styles.deleteMemo, styles.item)}>
            메모 삭제
          </div>
          <div
            className={classNames(styles.changeLabel, styles.item)}>
            라벨 변경
          </div>
        </div>
        <MemoEditor
          className={styles.memoEditor}
          memo={Immutable.Map({
            title: '임시 제목',
            content: '내용이다 ㅋ \nㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ\n\n\n\n\n\n여러줄 띄어봤당',
            labelIds: Immutable.List(),
            updatedAt: 1047392873,
          })}
        />
        {/*<EditModal*/}
          {/*show={this.state.showEditLabelModal}*/}
          {/*value={this.props.currentLabel.get('name')}*/}
          {/*onCancel={this.onHideEditLabelModal}*/}
          {/*onSubmit={this.onSubmitEditLabelModal}*/}
          {/*title="라벨 이름"*/}
          {/*ok="변경"*/}
          {/*cancel="취소" />*/}
      </div>
    )
  }
}

MemoView.propTypes = {
  className: PropTypes.string,
  tab: PropTypes.number,
  changeTab: PropTypes.func,
}

MemoView.defaultProps = {
  className: '',
  tab: 3,
  changeTab: () => {},
}

export default MemoView