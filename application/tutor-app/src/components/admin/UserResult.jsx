const UserResult = ({username, userId}) =>{

    const handleDelete = async () =>{
        //delete the user by their username
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/deleteUser`, {userId: userId}, {withCredentials: true});
        if(res.data.success){
            alert(`user: ${username} successfully deleted.`);
            //TODO: rerender the userList without the newly deleted user result
            //could either set this component to display: none or pass a refresh function from the Admin parent component and call it
        }
    }

    const handleEdit = () =>{
        //open up a react modal
    }

    const handleApplyChanges = async () =>{
        //TODO: should pass all fields from the modal to the second argument. Also need to create the route in the backend
        const res =  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/EditUser`, {userId: userId}, {withCredentials: true});
    }

    return (
        <div className = "user-result">
            <p>{username}</p>
            <button onClick={handleDelete}>X</button>
            <button onClick={handleEdit}>Edit</button>
        </div>
    )
}

export default UserResult;