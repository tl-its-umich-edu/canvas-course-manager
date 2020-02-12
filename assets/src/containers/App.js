import React from 'react'
import { withRouter } from 'react-router-dom'
import Source from './Source'
import Another from './Another'

function App () {
  return (
    <div className='App'>
      <h1>Canvas Course Manager</h1>
      <Source />
      <Another />
    </div>
  )
}

export default withRouter(App)
