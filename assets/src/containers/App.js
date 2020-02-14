import React from 'react'
import { withRouter } from 'react-router-dom'
import Header from '../components/Header'
import Admin from '../components/Admin'

function App () {
  return (
    <div className='App'>
      <Header />
      <Admin />
    </div>
  )
}

export default withRouter(App)
