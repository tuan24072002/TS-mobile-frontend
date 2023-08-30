import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageDoseNotExist from '../Page_Does_Not_Exist/PageDoseNotExist';

const ChangePassword = ({ username }) => {
    const [user, setUser] = useState('');
    axios.defaults.withCredentials = true;
    const [value, setValue] = useState({
        currentpass: '',
        newpass: '',
        confirmnewpass: ''
    });
    const navigate = useNavigate();
    useEffect(() => {
        setUser(username);
    }, [username]);
    const handleInputChange = (event) => {
        setValue(prev => ({ ...prev, [event.target.name]: event.target.value }))
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (value.newpass === value.confirmnewpass) {
            await axios.post(`http://localhost:1234/check-currentpass/${username}`, { currentpass: value.currentpass })
                .then(res => {
                    if (res && res.data.result === true) {
                        axios.post(`http://localhost:1234/change-password/${username}`, { newpass: value.newpass })
                            .then(pass => {
                                if (pass && pass.data.change_password === true) {
                                    toast.success('Change password successfully !!!');
                                    navigate('/');
                                } else if (pass && pass.data.change_password === false) {
                                    toast.error('Something wrong !!!');
                                }
                            }).catch(errPass => console.log(errPass));
                    } else if (res && res.data.result === false) {
                        toast.error('Wrong current password !!!');
                    }
                }).catch(err => console.log(err));
        } else {
            toast.error('Confirm new pass does not match !!!');
        }
    }
    return (

        user !== '' ? (
            <div className='all-info d-flex vh-100 justify-content-center bg-white align-items-center'>
                <div className='info p-3 w-50'>
                    <form onSubmit={handleSubmit} >
                        <Link to={'/'} className='btn-back btn btn-warning'>Back</Link>
                        <div className='title'><p className='text-center fw-bold'>Change Password</p></div>
                        <div className='mb-3'>
                            <label htmlFor='username' className='fw-bold'>Current Password(*)</label>
                            <input type='password' name='currentpass' onChange={handleInputChange} className='form-control' placeholder='Enter your Current Password' required />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='username' className='fw-bold'>New Password(*)</label>
                            <input type='password' name='newpass' onChange={handleInputChange} className='form-control' placeholder='Enter your New Password' required />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='username' className='fw-bold'>Confirm New Password(*)</label>
                            <input type='password' name='confirmnewpass' onChange={handleInputChange} className='form-control' placeholder='Enter your Confirm New Password' required />
                        </div>
                        <button type='submit' className='btn btn-dark w-25'>Save</button>
                    </form>
                </div>
            </div>
        ) :
            <PageDoseNotExist />
    )
}

export default ChangePassword