/* External Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './LabelList.scss'
import LabelListItem from './LabelListItem'

const LabelList = ({ className, labels }) => (
  <div className={classNames(styles.wrapper, className)}>
    {labels.map(label => <LabelListItem key={label.get('_id')} label={label} />)}
  </div>
)

LabelList.propTypes = {
  className: PropTypes.string,
  labels: PropTypes.instanceOf(Immutable.List),
}

LabelList.defaultProps = {
  className: '',
  labels: Immutable.List(),
}

export default LabelList