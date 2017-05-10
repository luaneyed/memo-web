/* Internal dependencies */
import client from './lib'

/*
 const labelSchema = new Mongoose.Schema({
   name: String,
   createdAt: Number,
 })
 */

export function getList() {
  return client.get('labels')
}

export function create(label) {
  return client.post('label', label)
}

export function update(labelId, label) {
  return client.put(`label/${labelId}`, label)
}

export function remove(labelId) {
  return client.delete(`label/${labelId}`)
}
