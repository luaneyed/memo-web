/* Internal dependencies */
import client from './lib'

/*
 const memoSchema = new Mongoose.Schema({
   title: String,
   content: String,
   labelIds: [String],
   updatedAt: Number,
 })
 */

export function getList() {
  return client.get('memos')
}

export function create(memo) {
  return client.post('memo', memo)
}

export function update(memoId, memo) {
  return client.put(`memo/${memoId}`, memo)
}

export function remove(memoId) {
  return client.delete(`memo/${memoId}`)
}

export function removeMany(memoIds) {
  return client.post('memos', memoIds)
}

export function attachLabels(memoIds, labelIds) {
  return client.post('memos/attach_labels', { memoIds, labelIds })
}

export function detachLabels(memoIds, labelIds) {
  return client.post('memos/detach_labels', { memoIds, labelIds })
}
