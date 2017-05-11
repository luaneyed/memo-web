/* External Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Immutable from 'immutable'

/* Internal Dependencies */
import styles from './MemoEditor.scss'
import Transformer from './Transformer'
import { displayTime } from '../../../utils/momentUtils'

class MemoEditor extends React.Component {
  render() {
    const { className, memo } = this.props
    return (
      <div className={classNames(styles.wrapper, className)}>
        <Transformer
          className={styles.title}
          value={memo.get('title')}
          onChange={newTitle => { this.props.updateMemo(this.props.memo.set('title', newTitle)) }} />
        <div className={styles.updatedAt}>{displayTime(memo.get('updatedAt'))}</div>
        <Transformer
          className={styles.content}
          value={memo.get('content')}
          onChange={newContent => { this.props.updateMemo(this.props.memo.set('content', newContent)) }} />
      </div>
    )
  }
}

MemoEditor.propTypes = {
  className: PropTypes.string,
  memo: PropTypes.instanceOf(Immutable.Map),
  updateMemo: PropTypes.func,
}

MemoEditor.defaultProps = {
  className: '',
  memo: Immutable.Map(),
  updateMemo: () => {},
}

export default MemoEditor