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
  return client.put(`memo/:${memoId}`, memo)
}

export function remove(memoId) {
  return client.delete(`memo/:${memoId}`)
}
