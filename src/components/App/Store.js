import Immutable from 'immutable'
import { LabelAPI, MemoAPI } from '../../api'

const listToMap = list => Immutable.Map().withMutations(
  immutable => {
    list.forEach(elem => {
      immutable.set(elem._id, Immutable.Map(elem))
    })
  })

const listToSet = list => Immutable.Set().withMutations(
  immutable => {
    list.forEach(elem => {
      immutable.add(elem)
    })
  })

const convertMemosToImmutable = memos =>
  listToMap(memos).map(memo => memo.set('labelIds', listToSet(memo.get('labelIds'))))

const convertMemoToImmutable = memo => {
  const labelIds = memo.labelIds
  if (labelIds) {
    memo.labelIds = listToSet(labelIds)
  }
  return Immutable.Map(memo)
}

const convertMemoToObject = memo => memo.set('labelIds', memo.get('labelIds').toArray()).toObject()


export default {

  //  API Call Handling

  getLabels() {
    return LabelAPI.getList()
      .then(res => {
        this.setState({ labels: listToMap(res) }, this.validateSearchQuery)
      })
      .catch(e => console.error(e))
  },
  getMemos() {
    return MemoAPI.getList()
      .then(res => {
        this.setState({
          memos: convertMemosToImmutable(res),
        })
      })
      .catch(e => console.error(e))
  },
  createLabel(name) {
    return LabelAPI.create({ name })
      .then(label => {
        this.setState(({ labels }) => ({
          labels: labels.set(label._id, Immutable.Map(label)),
        }))
      })
      .catch(this.showError)
  },
  updateLabel(label) {
    return LabelAPI.update(label.get('_id'), label.toObject())
      .then(updatedLabel => {
        this.setState(({ labels }) => ({
          labels: labels.set(updatedLabel._id, convertMemoToImmutable(updatedLabel)),
        }))
      })
      .catch(this.showError)
  },
  deleteLabel(label) {
    const labelId = label.get('_id')
    if (labelId && labelId !== 'all') {
      return LabelAPI.remove(labelId)
        .then(memos => {
          const newMemos = convertMemosToImmutable(memos)
          this.setState(state => ({
            labels: state.labels.remove(labelId),
            memos: state.memos.withMutations(prevMemos => {
              newMemos.forEach(newMemo => {
                prevMemos.set(newMemo.get('_id'), newMemo)
              })
            }),
          }))
          this.removeCurrentLabelId()
        })
        .catch(this.showError)
    }
    return Promise.reject()
  },
  createMemo() {
    const currentLabelId = this.getCurrentLabelId()
    const labelIds = currentLabelId === 'all' ? [] : [currentLabelId]
    return MemoAPI.create({
      title: '새 메모',
      labelIds,
    })
      .then(memo => {
        const newMemoId = memo._id
        this.setState(({ memos }) => ({
          memos: memos.set(newMemoId, convertMemoToImmutable(memo)),
        }), () => {
          this.setCurrentMemoId(newMemoId)
        })
      })
      .catch(this.showError)
  },
  updateMemo(memo) {
    return MemoAPI.update(memo.get('_id'), convertMemoToObject(memo))
      .then(updatedMemo => {
        this.setState(({ memos }) => ({
          memos: memos.set(updatedMemo._id, convertMemoToImmutable(updatedMemo)),
        }))
      })
      .catch(this.showError)
  },
  deleteMemo(memoId) {
    return MemoAPI.remove(memoId)
      .then(() => {
        this.setState(({ memos }) => ({
          memos: memos.remove(memoId),
        }))
        this.removeCurrentMemoId()
      })
      .catch(this.showError)
  },
  deleteMemos(memoIds) {
    return MemoAPI.removeMany(memoIds)
      .then(() => {
        this.setState(({ memos }) => ({
          memos: memos.withMutations(ms => {
            memoIds.forEach(memoId => {
              ms.delete(memoId)
            })
          }),
        }))
        if (memoIds.includes(this.getCurrentMemoId())) {
          this.removeCurrentMemoId()
        }
      })
      .catch(this.showError)
  },
  attachLabels(memoIds, labelIds) {
    return MemoAPI.attachLabels(memoIds, labelIds)
      .then(memos => {
        const newMemos = convertMemosToImmutable(memos)
        this.setState(({ memos }) => ({
          memos: memos.withMutations(prevMemos => {
            newMemos.forEach(newMemo => {
              prevMemos.set(newMemo.get('_id'), newMemo)
            })
          }),
        }))
      })
      .catch(this.showError)
  },
  detachLabels(memoIds, labelIds) {
    return MemoAPI.detachLabels(memoIds, labelIds)
      .then(memos => {
        const newMemos = convertMemosToImmutable(memos)
        this.setState(({ memos }) => ({
          memos: memos.withMutations(prevMemos => {
            newMemos.forEach(newMemo => {
              prevMemos.set(newMemo.get('_id'), newMemo)
            })
          }),
        }))
      })
      .catch(this.showError)
  },

  //  Getter Utils

  getCurrentLabel() {
    return this.state.countedLabels.get(this.getCurrentLabelId()) || Immutable.Map()
  },
  getCurrentMemo() {
    return this.state.memos.get(this.getCurrentMemoId()) || Immutable.Map()
  },
  getLabelList(state = this.state) {
    return state.countedLabels.toList().sort(
      (label1, label2) => {
        if (label1.get('_id') === 'all') {
          return -1
        }
        if (label2.get('_id') === 'all') {
          return 1
        }
        return (label1.get('createdAt') < label2.get('createdAt') ? 1 : -1)
      }
    )
  },
  getMemoList(state = this.state) {
    const currentLabelId = this.getCurrentLabelId()
    return state.memos
      .filter(memo => currentLabelId === 'all' || memo.get('labelIds').has(currentLabelId))
      .toList()
      .sort((label1, label2) => (label1.get('updatedAt') < label2.get('updatedAt') ? 1 : -1))
  },
}
