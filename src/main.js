import React from 'react'
import ReactDom from 'react-dom'
import routes from './routes'

require('es6-promise').polyfill()
require('babel-polyfill')

ReactDom.render(routes, window.document.getElementById('main'))