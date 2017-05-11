/* External dependencies */
import React from 'react'
import PropTypes from 'prop-types'

/* Internal dependencies */
import styles from './EditModal.scss'
import Modal from '../Modal'

class EditModal extends React.Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.doSubmit = this.doSubmit.bind(this)
    this._refs = {}
    this.state = {
      value: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show && !this.props.show) {
      this.setState({
        value: nextProps.value || ''
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      this._refs.input.focus()
    }
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    })
  }

  doSubmit() {
    this.props.onSubmit(this.state.value)
  }

  render() {
    const { show, onCancel, title, cancel, ok, onSubmit, ...props } = this.props
    return (
      <Modal show={show} onHide={onCancel}>
        <div className={styles.wrapper} {...props}>
          <div className={styles.editArea}>
            <div className={styles.title}>{title}</div>
            <input
              ref={e => { if (e) { this._refs.input = e } }}
              className={styles.input}
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
              onKeyPress={e => { if (e.charCode === 13) { this.doSubmit() } }} />
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

EditModal.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  show: PropTypes.bool,
  ok: PropTypes.string,
  cancel: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
}

EditModal.defaultProps = {
  title: '',
  value: '',
  show: false,
  ok: '',
  cancel: '',
  onSubmit: () => {},
  onCancel: () => {},
}

export default EditModal
