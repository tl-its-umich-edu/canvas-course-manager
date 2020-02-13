import React from 'react'
import { withRouter } from 'react-router-dom'
import Header from '../components/Header'

function App () {
  return (
    <div className='App'>
      <Header />
    </div>
  )
}

export default withRouter(App)
