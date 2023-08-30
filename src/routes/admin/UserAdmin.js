import React, { useCallback, useEffect, useState } from 'react'
import SideBar from '../../components/admin/SideBar'
import '../../styles/admin/UserAdmin.scss';
import axios from 'axios';
const UserAdmin = () => {
    const [allUser, setAllUser] = useState([]);
    const getAllUser = useCallback(async () => {
        await axios.get(`http://localhost:1234/get-all-user-admin`)
            .then(res => {
                if (res) {
                    setAllUser(res.data);
                }
            }).catch(err => console.log(err));
    }, []);
    useEffect(() => {
        getAllUser();
    }, [getAllUser]);
    const handleAddToBlackList = async (username) => {
        const confirm = window.confirm(`Are you sure to add this user to the blacklist?`);
        if (confirm) {
            await axios.get(`http://localhost:1234/add-to-blacklist/${username}`)
                .then(res => {
                    if (res && res.data.addBlackList === true) {
                        getAllUser();
                    } else {
                        alert(`Failed !!!`);
                    }
                }).catch(err => console.log(err));
        }
    }
    const handleDeleteUser = async (username) => {
        const confirm = window.confirm(`Are you sure to delete this user?`);
        if (confirm) {
            await axios.delete(`http://localhost:1234/delete-user/${username}`)
                .then(res => {
                    if (res && res.data.deleteUser === true) {
                        getAllUser();
                    } else {
                        alert(`Failed !!!`);
                    }
                }).catch(err => console.log(err));
        }
    }
    return (
        <div className='all-admin'>
            <div className='container-fluid bg-white'>
                <div className='row'>
                    <div className='col-2 bg-white border'>
                        <SideBar />
                    </div>
                    <div className='col-10 p-0'>
                        <div className='all-user-management container-fluid p-0 bg-white'>
                            <div className='top d-flex p-2 w-100'>
                                <p className='fs-3 fw-bold me-5'>User Management</p>
                            </div>
                            <div className='table-user'>
                                <table className='table text-center'>
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Name</th>
                                            <th>Avatar</th>
                                            <th>Phonenumber</th>
                                            <th>Email</th>
                                            <th>Address</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allUser.map((user) => {
                                                return (

                                                    <tr key={user.username}>
                                                        <td>{user.username}</td>
                                                        <td>{user.name}</td>
                                                        <td className='avatar-box'>
                                                            <div className='avatar'>
                                                                {
                                                                    user.avatar ?
                                                                        (
                                                                            <img src={`http://localhost:1234/avatar/${user.avatar}`} alt='' />
                                                                        ) :
                                                                        (
                                                                            <img src={`http://localhost:1234/avatar/user-null.png`} alt='' />
                                                                        )
                                                                }
                                                            </div>
                                                        </td>
                                                        <td>{user.phonenumber}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.address}</td>
                                                        <th>
                                                            <button className='btn btn-dark' onClick={() => handleAddToBlackList(user.username)}>BlackList</button> / <button className='btn btn-danger' onClick={() => handleDeleteUser(user.username)}>Delete</button>
                                                        </th>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAdmin