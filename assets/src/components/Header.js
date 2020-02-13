import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  }
})

function Header () {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            Canvas Course Manager
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
