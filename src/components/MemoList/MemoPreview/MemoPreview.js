/* External Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './MemoPreview.scss'

const MemoPreview = ({ className, memo, onClick }) => (
  <div className={classNames(styles.wrapper, className)} onClick={onClick}>
    {`${memo.get('title')} (${memo.get('content')})`}
  </div>
)

MemoPreview.propTypes = {
  className: PropTypes.string,
  memo: PropTypes.instanceOf(Immutable.Map),
}

MemoPreview.defaultProps = {
  className: '',
  memo: Immutable.Map(),
}

export default MemoPreview