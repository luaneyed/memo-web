/* External dependencies */
import React from 'react'
import { Router, Route } from 'react-router'
import { createHashHistory } from 'history'

/* Internal dependencies */
import App from './components/App'

export default (
  <Router history={createHashHistory({ queryKey: false })}>
    <Route path="/" component={App} />
  </Router>
)
