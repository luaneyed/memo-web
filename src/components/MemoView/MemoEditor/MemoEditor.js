/* External Dependencies */
import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './MemoEditor.scss'

const MemoEditor = ({ className, memo }) => (
  <div className={classNames(styles.wrapper, className)}>
    <div className={styles.title}>{memo.get('title')}</div>
    <div className={styles.updatedAt}>{moment(memo.get('updatedAt')).format(`h:mm A, YYYY/MM/DD`)}</div>
    <div className={styles.content}>{memo.get('content')}</div>
  </div>
)

MemoEditor.propTypes = {
  className: PropTypes.string,
  memo: PropTypes.instanceOf(Immutable.Map),
}

MemoEditor.defaultProps = {
  className: '',
  memo: Immutable.Map(),
}

export default MemoEditor