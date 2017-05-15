/* External Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './LabelListItem.scss'

const LabelListItem = ({ className, label, selected, onClick }) => (
  <div className={classNames(styles.wrapper, className, { [styles.selected]: selected })} onClick={onClick}>
    <div className={styles.name}>{label.get('name')}</div>
    <div className={styles.memoCount}>{`(${label.get('memoCount')})`}</div>
  </div>
)

LabelListItem.propTypes = {
  className: PropTypes.string,
  label: PropTypes.instanceOf(Immutable.Map),
  selected: PropTypes.bool,
  onClick: PropTypes.func,
}

LabelListItem.defaultProps = {
  className: '',
  label: Immutable.Map(),
  selected: false,
  onClick: () => {},
}

export default LabelListItem
