import React, { useState } from 'react'
import useGetFetch from '../hooks/useGetFetch'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import Cookie from 'js-cookie'
import handleError from '../utils/apiUtils'

const useStyles = makeStyles(theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}))

function Admin () {
  const classes = useStyles()
  const [task, setTask] = useState('')
  const [csvButtonVisibility, setCsvButtonVisibility] = useState(false)
  const [postedData, setPostedData] = useState({})
  const [loaded, error, info] = useGetFetch('/isAdmin/')
  if (error) return (<div>Did not fetch any data</div>)

  const handleAdminTaskFilter = event => {
    const value = event.target.value
    setTask(value)
    setCsvButtonVisibility(value === 'createSections' || value === 'addUsersToSection')
    fetch('/sendAdminTask/', {
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': Cookie.get('csrftoken')
      },
      credentials: 'include',
      body: JSON.stringify(value),
      method: 'POST'
    }).then(handleError)
      .then(res => res.json())
      .then(data => {
        setPostedData(data)
      }).catch(error => setPostedData(error.message))
  }

  const handleFileUpload = event => {
    const csv = event.target.files[0]
    const formData = new FormData()
    formData.append('csvData', csv)
    fetch('/routeSectionData/', {
      method: 'POST',
      body: formData
    })
      .then(handleError)
      .then(res => res.json())
      .then(response => {
        console.log(response)
        // If response is okay return info that file was received
        // set visibility to file upload field false again?
      }).catch(error => setPostedData(error.message))
  }

  return (
    !loaded || !info.isAdmin ? <div> You are not Admin in Course</div>
      : <>
        <div>
          <Typography>Sub-Account Administrator Utilities</Typography>
          <FormControl className={classes.formControl}>
            <InputLabel id='demo-controlled-open-select-label'>Select a task</InputLabel>
            <Select
              value={task}
              onChange={handleAdminTaskFilter}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value='createSections'>Add multiple new sections to course through CSV</MenuItem>
              <MenuItem value='addUsersToSection'>Add multiple users to course sections through CSV</MenuItem>
            </Select>
          </FormControl>
            <input
              accept="text/csv"
              id="upload-csv"
              hidden
              type="file"
              onChange={handleFileUpload}
            />
          {csvButtonVisibility &&
          <label htmlFor="upload-csv">
            <Button variant="contained" component="span" className={classes.button}>Upload</Button>
          </label>
          }
        </div>

        {Object.entries(postedData).length !== 0 ? <div> Admin Task '{task}' is in Progress for course {postedData.course_id}, will update once done</div> : ''}
      </>
  )
}

export default Admin
