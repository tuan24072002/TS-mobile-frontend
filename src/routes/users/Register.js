import React, { useEffect, useState } from 'react'
import '../../styles/users/Register.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Register = () => {
    const [values, setValues] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmpassword: '',
        phonenumber: '',
        address: '',
        avatar: 'user-null.png'
    });
    const handleInputChange = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    };
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (values.password === values.confirmpassword) {
            await axios.get('http://localhost:1234/check-email/' + values.email)
                .then(res => {
                    console.log(values.avatar);
                    if (res && res.data && res.data.length > 0) {
                        toast.error('Email already exists !!!');
                    }
                    else {
                        axios.post('http://localhost:1234/register', values)
                            .then(res => {
                                if (res.status === 200) {
                                    navigate('/login');
                                }
                            })
                            .catch(err => toast.error('Username already exists !!!'));
                    }
                }).catch(err => console.log(err));
        } else {
            toast.error('Confirm Password does not match !!!');
        }
    };
    useEffect(() => {
        axios.get('http://localhost:1234/')
            .then(res => {
                if (res.data.success === true) {
                    navigate('/');
                } else
                    navigate('/register');
            }).catch(err => console.log(err));
    }, [navigate]);
    return (
        <div className='all-register'>
            <h1 className='registerTitle'>Register</h1>
            <div className='register-wrapper'>
                <div className="d-flex flex-column justify-content-center align-items-center h-100 border">
                    <form className="w-75 d-flex flex-column" onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className='mb-3 col-6'>
                                <label htmlFor='name'>Name (*)</label>
                                <input type='text' placeholder='Enter your Name' name='name' id='name' className='form-control' onChange={(e) => handleInputChange(e)} required />
                            </div>
                            <div className='mb-3 col-6'>
                                <label htmlFor='username'>Username (*)</label>
                                <input type='text' name='username' placeholder='Enter your Username' id='username' className='form-control' onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email (*)</label>
                            <input type="email" name='email' placeholder='Enter your Email' className="form-control" id="email" onChange={handleInputChange} required />
                        </div>
                        <div className='row'>
                            <div className="mb-3 col-6">
                                <label htmlFor="password" className="form-label">Password (*)</label>
                                <input type="password" placeholder='Enter your Password' className="form-control" id="password" name='password' onChange={handleInputChange} required />
                            </div>
                            <div className="mb-3 col-6">
                                <label htmlFor="confirmpassword" className="form-label">Confirm Password (*)</label>
                                <input type="password" placeholder='Enter your Confirm Password' className="form-control" id="confirmpassword" name='confirmpassword' onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='phonenumber'>Phonenumber (*)</label>
                            <input type='number' className='form-control' placeholder='Enter your Phonenumber' id='phonenumber' name='phonenumber' onChange={handleInputChange} required />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='address'>Address (*)</label>
                            <input type='text' className='form-control' id='address' placeholder='Enter your Address' name='address' onChange={handleInputChange} required />
                        </div>
                        <div className="d-flex justify-content-center mt-4">
                            <button type="submit" className="btn btn-dark btn-lg w-25">Submit</button>
                        </div>
                    </form>
                    <a href='/login' className='mt-2'>Have been already an account?</a>
                    {/* <p className='text-center'>{notmatch}</p> */}
                </div>
            </div>
        </div>
    )
}

export default Register