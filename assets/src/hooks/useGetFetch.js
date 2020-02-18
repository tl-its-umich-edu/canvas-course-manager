import { useState, useEffect } from 'react'

const useGetFetch = (url) => {
  const [data, setData] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const defaultFetchOptions = {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    credentials: 'include'
  }
  const fetchOptions = { method: 'get', ...defaultFetchOptions }
  const handleError = res => {
    if (!res.ok) throw Error(res.statusText)
    return res
  }

  useEffect(() => {
    fetch(url, fetchOptions)
      .then(handleError)
      .then(response => response.json())
      .then(data => {
        setData(data)
        setLoaded(true)
      })
      .catch(error => setError(error))
  }, [url])
  return [loaded, error, data]
}

export default useGetFetch
