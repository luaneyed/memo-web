/* Internal dependencies */
import client from './lib'

export function getList() {
  return client.get('labels')
}

export function create(label) {
  return client.post('label', label)
}

export function update(labelId, label) {
  return client.put(`label/:${labelId}`, label)
}

export function remove(labelId) {
  return client.delete(`label/:${labelId}`)
}
