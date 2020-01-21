import React, { useState, Fragment } from 'react'
import AddUserForm from './forms/AddUserForm'
import EditUserForm from './forms/EditUserForm'
import UserTable from './tables/UserTable'
import Api from './Api';
import * as Constants from './Constants';

const App = () => {
	// Data
	const usersData = [
		{ id: 1, name: 'Tania', username: 'floppydiskette' },
		{ id: 2, name: 'Craig', username: 'siliconeidolon' },
		{ id: 3, name: 'Ben', username: 'benisphere' },
	]

	const initialFormState = { id: null, name: '', username: '' }

	// Setting state
	const [ users, setUsers ] = useState(usersData)
	const [ currentUser, setCurrentUser ] = useState(initialFormState)
	const [ editing, setEditing ] = useState(false)

	function getInfoPayload(name, username){
		return { 
			"fields": 
			{ 
				"name": { "stringValue": name }, 
				"username": { "stringValue": username }
			} 
		}
	}

	// CRUD operations
	const addUserAPI = user => {
		console.log('call api');
		let payload = getInfoPayload(user.name, user.username);

		Api.post(`projects/${Constants.PROJECT_NAME}/databases/(default)/documents/${Constants.USERS_COLLETICTION_NAME}`, payload)
		.then(res => {
			console.log(res);
			user.id = res.data.name;
			setUsers([ ...users, user ]);
		}).catch(err => {
			console.log(err);
		});
	}

	const deleteUser = id => {
		setEditing(false)

		setUsers(users.filter(user => user.id !== id))
	}

	const updateUserAPI = (id, updatedUser) => {
		console.log('call api');
		let payload = getInfoPayload(updatedUser.name, updatedUser.username);

		Api.patch(`${id}`, payload)
		.then(res => {
			console.log(res);
			setUsers(users.map(user => (user.id === id ? updatedUser : user)))
			setEditing(false);
		}).catch(err => {
			console.log(err);
		});
	}

	const editRow = user => {
		setEditing(true)

		setCurrentUser({ id: user.id, name: user.name, username: user.username })
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
								updateUser={updateUserAPI}
							/>
						</Fragment>
					) : (
						<Fragment>
							<h2>Add user</h2>
							<AddUserForm addUser={addUserAPI} />
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
