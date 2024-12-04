/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import UserList from './components/UserList'

function App() {
  const originalUsers = useRef<User[]>([])

  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.NONE)
  const [filteredCountry, setFilteredCountry] = useState<string|undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`https://randomuser.me/api?results=10&seed=toto&page=${currentPage}`)
      .then(res => {
        if (!res.ok) throw new Error('Error en la petición')
        return res.json()
      })
      .then(res => {
        const newUsers = users.concat(res.results)
        setUsers(newUsers)
        originalUsers.current = newUsers
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
      .finally(() => setLoading(false))
  }, [currentPage])

  const filteredUsers = useMemo(() => {
    return filteredCountry
    ? users.filter(user => user.location.country.toLowerCase().includes(filteredCountry.toLowerCase()))
    : users
  }, [filteredCountry, users])

  const sortedUsers = useMemo(() => {
    if (sortBy === SortBy.NONE) return filteredUsers

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last,
      [SortBy.COUNTRY]: user => user.location.country,
    }

    return filteredUsers.toSorted((a, b) => {
      const property = compareProperties[sortBy]
      return property(a).localeCompare(property(b))
    })
  }, [filteredUsers, sortBy])

  const handleDelete = (idx: string) => {
    const filteredUsers = users.filter((user) => user.login.uuid !== idx)

    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleSort = (sort: SortBy) => {
    setSortBy(sort)
  }

  return (
    <>
      <h1>Mis Usuarios</h1>
      <header>
        <button onClick={() => setShowColors(!showColors)}>
          Colorear Filas
        </button>
        <button onClick={() => setSortBy(sortBy === SortBy.COUNTRY ? SortBy.NONE : SortBy.COUNTRY)}>
          {sortBy === SortBy.COUNTRY ? 'No ordenar por país' : 'Ordenar por país'}
        </button>
        <button onClick={handleReset}>
          Reset
        </button>
        <input
          type="text"
          placeholder='Filtra por país'
          value={filteredCountry}
          onChange={(e) => setFilteredCountry(e.target.value)}
        />
      </header>

      <main>
      {users.length > 0 && (
          
          <>
            <UserList
              users={sortedUsers}
              showColors={showColors}
              handleDelete={handleDelete}
              handleSort={handleSort}
            />
            <button
              onClick={() => setCurrentPage(currentPage+1)}
            >Cargar más usuarios
            </button>
          </>
        )}
        {loading && (<p>Cargando...</p>)}
        {!loading && error && (<p>Error</p>)}
        {!loading && !error && users.length === 0 && (<p>No hay usuarios</p>)}
      </main>
    </>
  )
}

export default App
