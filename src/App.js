import React, { useState, useEffect, Fragment } from 'react'
import AddUserForm from './components/forms/AddUserForm'
import EditUserForm from './components/forms/EditUserForm'
import UserTable from './components/tables/UserTable'
import Api from './Api';
import * as Constants from './Constants';

const App = () => {

	useEffect(() => {
		getUsersAPI();
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
	let usersData = [];
	const [ users, setUsers ] = useState(usersData);
	const [ currentUser, setCurrentUser ] = useState(initialFormState);
	const [ editing, setEditing ] = useState(false);

	// CRUD operations

	const addUserAPI = user => {
		console.log('call api');
		let payload = genaratePayload(user.name, user.username);

		Api.post(`projects/${Constants.PROJECT_NAME}/databases/(default)/documents/${Constants.USERS_COLLETICTION_NAME}`, payload)
		.then(res => {
			console.log(res);
			setUsers([...users, res.data]);
		}).catch(err => {
			console.log(err);
		});
	}

	const getUsersAPI = () => {
		console.log('call api');
		Api.get(`projects/${Constants.PROJECT_NAME}/databases/(default)/documents/${Constants.USERS_COLLETICTION_NAME}`)
		.then(res => {

			if(res.data.documents == null)
				usersData = [];
			else
				usersData = res.data.documents;

			setUsers(usersData);
		}).catch(err => {
			console.log(err);
		});
	}
	
	const updateUserAPI = (id, updatedUser) => {
		console.log('call api');
		
		let payload = genaratePayload(updatedUser.fields.name.stringValue, updatedUser.fields.username.stringValue);
		Api.patch(`${id}`, payload)
		.then(res => {
			setUsers(users.map(user => (user.name === id ? updatedUser : user)))
			setEditing(false);
		}).catch(err => {
			console.log(err);
		});
	}

	const deleteUserAPI = id => {
		console.log('call api');
		
		Api.delete(`${id}`)
		.then(res => {
			setEditing(false);
			setUsers(users.filter(user => user.name !== id));
		}).catch(err => {
			console.log(err);
		});
	}

	// AUXs Methods

	function genaratePayload(name, username){
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
			<h1>CRUD App with Hooks and API</h1>
			<div className="flex-row">
				<div className="flex-large">
					{
						editing ? 
						(
							<Fragment>
								<h2>Edit user</h2>
								<EditUserForm
									editing={editing}
									setEditing={setEditing}
									currentUser={currentUser}
									updateUser={updateUserAPI}
								/>
							</Fragment>
						) 
						: 
						(
							<Fragment>
								<h2>Add user</h2>
								<AddUserForm addUser={addUserAPI} />
							</Fragment>
						)
					}
				</div>
				<div className="flex-large">
					<h2>View users</h2>
					<UserTable users={users} editRow={editRow} deleteUser={deleteUserAPI} />
				</div>
			</div>
		</div>
	)
}

export default App;