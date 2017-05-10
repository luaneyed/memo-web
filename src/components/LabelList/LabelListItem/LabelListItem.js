/* External Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './LabelListItem.scss'

const LabelListItem = ({ className, label, onClick }) => (
  <div className={classNames(styles.wrapper, className)} onClick={onClick}>
    {`${label.get('name')} (${label.get('memoCount')})`}
  </div>
)

LabelListItem.propTypes = {
  className: PropTypes.string,
  label: PropTypes.instanceOf(Immutable.Map),
}

LabelListItem.defaultProps = {
  className: '',
  label: Immutable.Map(),
}

export default LabelListItem