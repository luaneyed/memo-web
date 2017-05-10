/* External dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Transition, Modal } from 'react-overlays'

/* Internal dependencies */
import styles from './Modal.scss'

const ModalElement = ({ show, onHide, children, className, wrapperClassName, backdropClassName, ...props }) => (
  <Transition in={show} enteringClassName={styles.modalEntering} enteredClassName={styles.modalEntered}>
    <Modal
      {...props}
      show={show}
      onHide={onHide}
      className={classNames(styles.modal, className)}
      backdropClassName={classNames(styles.backdrop, backdropClassName)}>
      <div
        className={classNames(styles.wrapper, wrapperClassName)}
        onClick={e => { if (e.target.classList.contains(styles.wrapper)) { onHide() } }}>
        {children}
      </div>
    </Modal>
  </Transition>
)

ModalElement.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  backdropClassName: PropTypes.string,
}

ModalElement.defaultProps = {
  show: false,
  onHide: () => {},
  children: null,
  className: '',
  wrapperClassName: '',
  backdropClassName: '',
}

export default ModalElement
