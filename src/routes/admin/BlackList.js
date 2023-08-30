import React, { useCallback, useEffect, useState } from 'react'
import SideBar from '../../components/admin/SideBar'
import axios from 'axios';
import '../../styles/admin/BlackList.scss';

const BlackList = () => {
    const [allUserBlackList, setAllUserBlackList] = useState([]);
    const getAllUserBlackList = useCallback(async () => {
        await axios.get(`http://localhost:1234/get-all-user-blacklist`)
            .then(res => {
                if (res) {
                    setAllUserBlackList(res.data);
                }
            }).catch(err => console.log(err));
    }, []);
    useEffect(() => {
        getAllUserBlackList();
    }, [getAllUserBlackList]);
    const outOfBlackList = async (username) => {
        const confirm = window.confirm(`Are you sure to remove the user from the blacklist?`);
        if (confirm) {
            await axios.get(`http://localhost:1234/out-of-blacklist/${username}`)
                .then(res => {
                    if (res && res.data.addBlackList === true) {
                        getAllUserBlackList();
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
                        getAllUserBlackList();
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
                                            allUserBlackList.map((user) => {
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
                                                            <button className='btn btn-success' onClick={() => outOfBlackList(user.username)}>Out of BlackList</button> / <button className='btn btn-danger' onClick={() => handleDeleteUser(user.username)}>Delete</button>
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

export default BlackList