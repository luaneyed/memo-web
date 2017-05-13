/* External dependencies */
import React from 'react'
import classNames from 'classnames'
import Immutable from 'immutable'
import PropTypes from 'prop-types'

/* Internal dependencies */
import styles from './SelectLabelModal.scss'
import Modal from '../../Modal'

class SelectLabelModal extends React.Component {
  constructor() {
    super()
    this.renderLabel = this.renderLabel.bind(this)
    this.doSubmit = this.doSubmit.bind(this)
    this.state = {
      selectedLabelIds: Immutable.Set(),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show && !this.props.show) {
      this.setState({
        selectedLabelIds: nextProps.selectedLabelIds
      })
    }
  }

  doSubmit() {
    this.props.onSubmit(this.state.selectedLabelIds)
  }

  renderLabel(label) {
    const labelId = label.get('_id')
    if (labelId === 'all') {
      return null
    }
    return (
      <div
        key={labelId}
        className={classNames(
          styles.label, { [styles.selected]: this.state.selectedLabelIds.has(labelId) }
        )}
        onClick={() => { this.setState(({ selectedLabelIds }) => ({
          selectedLabelIds: selectedLabelIds[selectedLabelIds.has(labelId) ? 'delete' : 'add'](labelId)
        })) }}>
        {label.get('name')}
      </div>
    )
  }


  render() {
    const { show, labelList, selectedLabelIds, cancel, ok, onSubmit, onCancel, ...props } = this.props
    return (
      <Modal show={show} onHide={onCancel}>
        <div className={styles.wrapper} {...props}>
          <div className={styles.body}>
            <div className={styles.title}>
              라벨 선택
            </div>
            <div className={styles.selector}>
              {labelList.map(this.renderLabel)}
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.buttons}>
            <div onClick={onCancel} className={styles.cancel}>{cancel}</div>
            <div onClick={this.doSubmit} className={styles.ok}>{ok}</div>
          </div>
        </div>
      </Modal>
    )
  }
}

SelectLabelModal.propTypes = {
  labelList: PropTypes.instanceOf(Immutable.List),
  selectedLabelIds: PropTypes.instanceOf(Immutable.Set),
  show: PropTypes.bool,
  ok: PropTypes.string,
  cancel: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
}

SelectLabelModal.defaultProps = {
  labelList: Immutable.List(),
  selectedLabelIds: Immutable.Set(),
  show: false,
  ok: '',
  cancel: '',
  onSubmit: () => {},
  onCancel: () => {},
}

export default SelectLabelModal
