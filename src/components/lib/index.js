/* External Dependencies */
import React from 'react'
import qs from 'querystringify'

class RoutingComponent extends React.Component {
  getCurrentLabelId() {
    return qs.parse(this.props.location.search).labelId
  }

  getCurrentMemoId() {
    return qs.parse(this.props.location.search).memoId
  }

  setCurrentLabelId(labelId) {
    const memoId = this.getCurrentMemoId()
    this.props.history.push(`/${qs.stringify(memoId ? { labelId, memoId } : { labelId }, true)}`)
  }

  setCurrentLabel(label) {
    this.setCurrentLabelId(label.get('_id') || label._id)
  }

  setCurrentMemoId(memoId) {
    const labelId = this.getCurrentLabelId()
    this.props.history.push(`/${qs.stringify(labelId ? { labelId, memoId } : { memoId }, true)}`)
  }

  setCurrentMemo(memo) {
    this.setCurrentMemoId(memo.get('_id') || memo._id)
  }
}

export default RoutingComponent