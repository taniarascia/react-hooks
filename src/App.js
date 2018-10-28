import React, { useState, Fragment } from 'react'
import AddUserForm from './forms/AddUserForm'
import EditUserForm from './forms/EditUserForm'
import UserTable from './tables/UserTable'

const App = () => {
	// Data
	const usersData = [
		{ name: 'Tania', username: 'floppydiskette' },
		{ name: 'Craig', username: 'siliconeidolon' },
		{ name: 'Ben', username: 'benisphere' },
	]

	const initialFormState = { name: '', username: '' }

	// Setting state
	const [ users, setUsers ] = useState(usersData)
	const [ currentUser, setCurrentUser ] = useState(initialFormState)
	const [ editing, setEditing ] = useState(false)

	// CRUD operations
	const addUser = user => {
		setUsers([ ...users, user ])
	}

	const updateUser = (id, updatedUser) => {
		setUsers(users.map(user => (user.name === id ? updatedUser : user)))

		setEditing(false)
	}

	const deleteUser = id => {
		setEditing(false)

		setUsers(users.filter(user => user.name !== id))
	}

	const editRow = user => {
		setEditing(true)

		setCurrentUser({ name: user.name, username: user.username })
	}

	return (
		<div className="container">
			<h1>CRUD App with Hooks</h1>
			<div className="flex-row">
				<div className="flex-large">
					{editing ? (
						<Fragment>
							<h2>Edit user</h2>
							<EditUserForm
								editing={editing}
								setEditing={setEditing}
								currentUser={currentUser}
								updateUser={updateUser}
							/>
						</Fragment>
					) : (
						<Fragment>
							<h2>Add user</h2>
							<AddUserForm addUser={addUser} />
						</Fragment>
					)}
				</div>
				<div className="flex-large">
					<h2>View users</h2>

					<UserTable users={users} editRow={editRow} deleteUser={deleteUser} />
				</div>
			</div>
		</div>
	)
}

export default App
