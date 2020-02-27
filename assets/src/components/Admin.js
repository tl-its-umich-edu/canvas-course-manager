import React, { useState, useEffect } from 'react'
import useGetFetch from '../hooks/useGetFetch'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import Cookie from 'js-cookie'
import parse from 'csv-parse/lib/sync'
import handleError from '../utils/apiUtils'

// Allow for switching routes dependent on selected task
const taskDefinitions = {
  createSections: {
    route: '/routeSectionData/',
    columns: ['id_prefix', 'name'],
    displayName: 'Section Data'
  },
  addUsersToSection: {
    route: '/routeUserSectionData/',
    columns: ['role', 'user_id', 'section_id'],
    displayName: 'User Data'
  }
}

const useStyles = makeStyles(theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(1)
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
  const [done, setDone] = useState({})
  const [loaded, error, info] = useGetFetch('/isAdmin/')
  if (error) return (<div>Did not fetch any data</div>)

  // useEffect(() => {
  //   console.log(task)
  // })

  const handleAdminTaskFilter = event => {
    const value = event.target.value
    setTask(value)
    setCsvButtonVisibility(value in taskDefinitions)
  }

  const parseFileAndPost = fileData => {
    const csvText = fileData.target.result
    const formData = new FormData()
    let parsedData
    try {
      parsedData = parse(csvText, {
        columns: taskDefinitions[task].columns, from_line: 2
      })
    } catch (err) {
      console.log(err)
    }
    formData.append('task', task)
    formData.append('data', JSON.stringify(parsedData))
    fetch(taskDefinitions[task].route, {
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': Cookie.get('csrftoken')
      },
      credentials: 'include',
      method: 'POST',
      body: formData
    })
      .then(handleError)
      .then(res => res.json())
      .then(response => {
        console.log(response)
        setDone(response)
        // If response is okay return info that file was received
        // set visibility to file upload field false again?
      }).catch(error => setPostedData(error.message))
  }

  const handleFileUpload = event => {
    const csv = event.target.files[0]
    const reader = new FileReader()
    reader.onload = parseFileAndPost
    reader.readAsText(csv)
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
            accept='text/csv'
            id='upload-csv'
            hidden
            type='file'
            onChange={handleFileUpload}
          />
          {csvButtonVisibility &&
            <label htmlFor='upload-csv'>
              <Button
                variant='contained'
                component='span'
                className={classes.button}
              >
              Upload {taskDefinitions[task].displayName} CSV
              </Button>
            </label>}
        </div>

        {Object.entries(done).length !== 0 ? <div> Admin Task '{task}' is successful and in Progress (tracking
          id {done.job_tracking_id})
        </div> : ''}
      </>
  )
}

export default Admin
