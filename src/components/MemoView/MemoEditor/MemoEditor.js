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
          fontClassName={styles.titleFont}
          value={memo.get('title')}
          onChange={newTitle => { this.props.updateMemo(this.props.memo.set('title', newTitle)) }} />
        <div className={styles.labels}>
          {this.props.memo.get('labelIds').map(labelId =>
            <span className={styles.label}>{this.props.labels.get(labelId).get('name')}</span>
          )}
        </div>
        <div className={styles.updatedAt}>{memo.isEmpty() ? '' : displayTime(memo.get('updatedAt'))}</div>
        <Transformer
          fontClassName={styles.contentFont}
          value={memo.get('content')}
          onChange={newContent => { this.props.updateMemo(this.props.memo.set('content', newContent)) }} />
      </div>
    )
  }
}

MemoEditor.propTypes = {
  className: PropTypes.string,
  memo: PropTypes.instanceOf(Immutable.Map),
  labels: PropTypes.instanceOf(Immutable.Map),
  updateMemo: PropTypes.func,
}

MemoEditor.defaultProps = {
  className: '',
  memo: Immutable.Map(),
  labels: Immutable.Map(),
  updateMemo: () => {},
}

export default MemoEditor