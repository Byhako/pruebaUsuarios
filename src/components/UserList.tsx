/* eslint-disable react/react-in-jsx-scope */
import { SortBy, type User } from '../types.d'

interface Props {
  users: User[]
  showColors: boolean
  handleDelete: (n: string) => void
  handleSort: (s: SortBy) => void
}


export default function UserList({
  users,
  showColors,
  handleDelete,
  handleSort
  }: Props
) {
  return (
    <table width='100%'>
      <thead>
        <tr>
          <th>Foto</th>
          <th
            className='sort'
            onClick={() => handleSort(SortBy.NAME)}
          >Nombre</th>
          <th
            className='sort'
            onClick={() => handleSort(SortBy.LAST)}
          >Apellido</th>
          <th
            className='sort'
            onClick={() => handleSort(SortBy.COUNTRY)}
          >País</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user, index) => {
          const bgColor = index % 2 === 0 ? '#333' : '#555'
          const color = showColors ? bgColor : 'transparent'
          return (
            <tr key={user.login.uuid} style={{ backgroundColor: color}}>
              <td>
                <img src={user.picture.thumbnail} alt={user.phone} />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => handleDelete(user.login.uuid)}>Borrar</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}