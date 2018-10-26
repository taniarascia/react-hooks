import React, { useState } from 'react'

function App() {
  // Data
  const usersData = [
    { name: 'Tania', username: 'floppydiskette' },
    { name: 'Dan', username: 'gaeron' },
  ]

  const initialFormState = { name: '', username: '' }

  // Setting state
  const [users, setUser] = useState(usersData)
  const [form, setForm] = useState(initialFormState)
  const [editForm, setEditForm] = useState(initialFormState)
  const [editing, setEditing] = useState(false)

  // CRUD operations
  const addUser = event => {
    event.preventDefault()

    if (!form.name || !form.username) return

    setUser([...users, form])
  }

  const updateUser = (id, updatedUser) => {
    setUser(users.map(user => (user.name === id ? updatedUser : user)))
    setEditing(false)
  }

  const deleteUser = id => {
    setUser(users.filter(user => user.name !== id))
  }

  const editRow = user => {
    setEditing(true)

    setEditForm({ name: user.name, username: user.username })
  }

  // Form state
  const handleInputChange = event => {
    const { name, value } = event.target

    setForm({ ...form, [name]: value })
  }

  const handleEditInputChange = event => {
    const { name, value } = event.target

    setEditForm({ ...editForm, [name]: value })
  }

  return (
    <div className="small-container">
      <h1>React CRUD App with Hooks</h1>
      <h3>Add New User</h3>
      <form onSubmit={addUser}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleInputChange}
        />
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleInputChange}
        />
        <button>Add new user</button>
      </form>

      <h2>View Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.name}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>
                  <button
                    onClick={() => editRow(user)}
                    className="button muted-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.name)}
                    className="button muted-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No users</td>
            </tr>
          )}
        </tbody>
      </table>
      {editing ? (
        <div>
          <h2>Edit User</h2>
          <form
            onSubmit={event => {
              event.preventDefault()
              updateUser(editForm.name, editForm)
            }}
          >
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditInputChange}
            />
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={editForm.username}
              onChange={handleEditInputChange}
            />
            <button>Update user</button>
            <button
              onClick={() => setEditing(false)}
              class="button muted-button"
            >
              Cancel
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}

export default App
