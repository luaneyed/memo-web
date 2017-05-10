/* External Dependencies */
import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './LabelList.scss'
import LabelListItem from './LabelListItem'
import RoutingComponent from '../lib'
import EditModal from '../EditModal'

@withRouter
class LabelList extends RoutingComponent {
  constructor() {
    super()
    this.onClickCreateLabel = this.onClickCreateLabel.bind(this)
    this.onHideCreateLabelModal = this.onHideCreateLabelModal.bind(this)
    this.onSubmitCreateLabelModal = this.onSubmitCreateLabelModal.bind(this)
    this.state = {
      showCreateLabelModal: false,
    }
  }

  onClickCreateLabel() {
    this.setState({
      showCreateLabelModal: true,
    })
  }

  onHideCreateLabelModal() {
    this.setState({
      showCreateLabelModal: false,
    })
  }

  onSubmitCreateLabelModal(labelName) {
    this.setState({
      showCreateLabelModal: false,
    })
    this.props.createLabel(labelName)
  }

  render() {
    const { className, labels } = this.props
    return (
      <div className={classNames(styles.wrapper, className)}>
        <div
          className={classNames(styles.createLabel, styles.item)}
          onClick={this.onClickCreateLabel}>
          라벨 추가하기
        </div>
        <div className={styles.labels}>
          {labels.map(label =>
            <LabelListItem key={label.get('_id')} className={styles.item} label={label} onClick={() => { this.setCurrentLabel(label) }} />
          )}
        </div>
        <EditModal
          show={this.state.showCreateLabelModal}
          onCancel={this.onHideCreateLabelModal}
          onSubmit={this.onSubmitCreateLabelModal}
          title="라벨 이름"
          ok="추가"
          cancel="취소" />
      </div>
    )
  }
}

LabelList.propTypes = {
  className: PropTypes.string,
  labels: PropTypes.instanceOf(Immutable.List),
  createLabel: PropTypes.func,
}

LabelList.defaultProps = {
  className: '',
  labels: Immutable.List(),
  createLabel: () => {},
}

export default LabelList