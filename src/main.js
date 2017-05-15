import React from 'react'
import ReactDom from 'react-dom'
import routes from './routes'
import { LocalStorage } from 'awesome-domstorage'

require('es6-promise').polyfill()
require('babel-polyfill')

LocalStorage.init({
  LANGUAGE: 'ko',
}, 'memo')

if (!LocalStorage.get('LANGUAGE')) {
  const language = (window.navigator.languages &&
    window.navigator.languages[0] ? window.navigator.languages[0] :
      (window.navigator.language || window.navigator.userLanguage))
    || 'en'
  const currentLocale = language.substr(0, 2)

  LocalStorage.set('LANGUAGE',
    ['ko', 'en'].includes(currentLocale) ?
      currentLocale :
      'ko'
  )
}

ReactDom.render(routes, window.document.getElementById('main'))