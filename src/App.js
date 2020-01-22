import React, { useState, useEffect, Fragment } from 'react'
import AddUserForm from './forms/AddUserForm'
import EditUserForm from './forms/EditUserForm'
import UserTable from './tables/UserTable'
import Api from './Api';
import * as Constants from './Constants';

const App = () => {

	// Data
	let usersData = [];
	useEffect(() => {
		Api.get(`projects/${Constants.PROJECT_NAME}/databases/(default)/documents/${Constants.USERS_COLLETICTION_NAME}`)
		.then(res => {
			console.log(res);
			if(res.data.documents == null)
				usersData = [];
			else
				usersData = res.data.documents;

			setUsers(usersData);
		}).catch(err => {
			console.log(err);
		});
	}, []);

	const initialFormState = 
	{
		name: '',
		fields: {
			name: {
				stringValue: ''
			},
			username: {
				stringValue: ''
			}
		}
	};

	// Setting state
	const [ users, setUsers ] = useState(usersData)
	const [ currentUser, setCurrentUser ] = useState(initialFormState)
	const [ editing, setEditing ] = useState(false)

	function getInfoPayload(name, username){
		return {
				fields: {
					name: {
						stringValue: name
					},
					username: {
						stringValue: username
					}
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
			setUsers([...users, res.data]);
		}).catch(err => {
			console.log(err);
		});
	}

	const deleteUserAPI = id => {
		console.log('call api');
		console.log(id);

		Api.delete(`${id}`)
		.then(res => {
			console.log(res);
			setEditing(false);
			setUsers(users.filter(user => user.name !== id));
		}).catch(err => {
			console.log(err);
		});
	}

	const updateUserAPI = (id, updatedUser) => {
		console.log('call api = id: ' + id);
		
		let payload = getInfoPayload(updatedUser.name, updatedUser.username);
		console.log(payload);

		Api.post(`${id}`, payload)
		.then(res => {
			console.log(res);
			setUsers(users.map(user => (user.name === id ? updatedUser : user)))
			setEditing(false);
		}).catch(err => {
			console.log(err);
		});
	}

	const editRow = user => {
		setEditing(true)

		setCurrentUser({
			name: user.name,
			fields: {
				name: {
					stringValue: user.fields.name.stringValue
				},
				username: {
					stringValue: user.fields.username.stringValue
				}
			}
		});
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
					<UserTable users={users} editRow={editRow} deleteUser={deleteUserAPI} />
				</div>
			</div>
		</div>
	)
}

export default App
