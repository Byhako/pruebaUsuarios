/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import './App.css'
import type { User } from './types'

function App() {
  const [users, setUsers] = useState<Array<User>>([])

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(res => res.json())
      .then(res => setUsers(res.results))
      .catch(error => console.error(error))
  }, [])

  return (
    <>
      <h1>Hola ruben</h1>
      {JSON.stringify(users)}
    </>
  )
}

export default App
