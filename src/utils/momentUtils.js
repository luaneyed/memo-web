import moment from 'moment'

export function displayTime(x) {
  return moment(x).format(`h:mm A, YYYY/MM/DD`)
}