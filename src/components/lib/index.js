/* External Dependencies */
import React from 'react'
import qs from 'querystringify'

class RoutingComponent extends React.Component {
  getCurrentLabelId(props = this.props) {
    return qs.parse(props.location.search).labelId
  }

  getCurrentMemoId(props = this.props) {
    return qs.parse(props.location.search).memoId
  }

  setCurrentLabelId(labelId, props = this.props) {
    const memoId = this.getCurrentMemoId(props)
    if (labelId !== this.getCurrentLabelId(props)) {
      props.history.push(`/${qs.stringify(memoId ? { labelId, memoId } : { labelId }, true)}`)
    }
  }

  setCurrentLabel(label) {
    this.setCurrentLabelId(label.get('_id') || label._id)
  }

  setCurrentMemoId(memoId, props = this.props) {
    const labelId = this.getCurrentLabelId(props)
    if (memoId !== this.getCurrentMemoId(props)) {
      props.history.push(`/${qs.stringify(labelId ? { labelId, memoId } : { memoId }, true)}`)
    }
  }

  setCurrentMemo(memo) {
    this.setCurrentMemoId(memo.get('_id') || memo._id)
  }

  replaceCurrentLabelId(labelId, props = this.props) {
    const memoId = this.getCurrentMemoId(props)
    if (labelId !== this.getCurrentLabelId(props)) {
      props.history.replace(`/${qs.stringify(memoId ? { labelId, memoId } : { labelId }, true)}`)
    }
  }

  replaceCurrentMemoId(memoId, props = this.props) {
    const labelId = this.getCurrentLabelId(props)
    if (memoId !== this.getCurrentMemoId(props)) {
      props.history.replace(`/${qs.stringify(labelId ? { labelId, memoId } : { memoId }, true)}`)
    }
  }

  removeCurrentLabelId(props = this.props) {
    const memoId = this.getCurrentMemoId(props)
    props.history.replace(`/${qs.stringify(memoId ? { memoId } : {}, true)}`)
  }

  removeCurrentMemoId(props = this.props) {
    const labelId = this.getCurrentLabelId(props)
    props.history.replace(`/${qs.stringify(labelId ? { labelId } : {}, true)}`)
  }
}

export default RoutingComponent