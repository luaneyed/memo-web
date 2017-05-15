/* External Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './MemoPreview.scss'
import { displayTime } from '../../../utils/momentUtils'

const MemoPreview = ({ className, memo, onClick }) => (
  <div className={classNames(styles.wrapper, className)} onClick={onClick}>
    <div className={styles.title}>{memo.get('title')}</div>
    <div className={styles.details}>
      <div className={styles.updatedAt}>{displayTime(memo.get('updatedAt'))}</div>
      <div className={styles.content}>{memo.get('content')}</div>
    </div>
  </div>
)

MemoPreview.propTypes = {
  className: PropTypes.string,
  memo: PropTypes.instanceOf(Immutable.Map),
  onClick: PropTypes.func,
}

MemoPreview.defaultProps = {
  className: '',
  memo: Immutable.Map(),
  onClick: () => {},
}

export default MemoPreview
