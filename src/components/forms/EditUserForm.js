import React, { useState } from 'react'

const EditUserForm = props => {
  const [ user, setUser ] = useState(props.currentUser);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, fields: {...user.fields, [name]: {stringValue: value}}});
  }

  const updateUserClicked = event => {
    event.preventDefault();
    props.updateUser(user.name, user);
  }

  return (
    <form onSubmit={updateUserClicked}>
      <label>Name</label>
      <input type="text" name="name" value={user.fields.name.stringValue} onChange={handleInputChange} />
      <label>Username</label>
      <input type="text" name="username" value={user.fields.username.stringValue} onChange={handleInputChange} />
      <button>Update user</button>
      <button onClick={() => props.setEditing(false)} className="button muted-button">
        Cancel
      </button>
    </form>
  )
}

export default EditUserForm;