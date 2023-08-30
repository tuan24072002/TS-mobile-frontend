import React, { useEffect, useState } from 'react'
import Google from '../../assets/images/google.png';
import Github from '../../assets/images/github.png';
import Facebook from '../../assets/images/facebook.png';
import '../../styles/users/Login.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: '',
        password: ''
    });
    axios.defaults.withCredentials = true;
    const handleInputChange = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:1234/login', values)
            .then(res => {
                if (res.data.success === true) {
                    window.location.reload(true);
                }
                if (res.data.BlackList === true) {
                    toast.error('Your account has been blocked !!!');
                }
            }).catch(err => toast.error('Invalid username or password !!!'));
    };
    useEffect(() => {
        axios.get('http://localhost:1234/')
            .then(res => {
                if (res.data.success === true) {
                    navigate('/');
                } else
                    navigate('/login');
            }).catch(err => console.log(err));
    }, [navigate]);
    return (
        <div className='all-login'>
            <h1 className='loginTitle'>Choose a Login Method</h1>
            <div className='wrapper'>
                <div className='left'>
                    {/* onClick={google} */}
                    <div className='loginButton google'>
                        <img src={Google} alt='' className='icon' />
                        Google
                    </div>
                    <div className='loginButton facebook'>
                        <img src={Facebook} alt='' className='icon' />
                        Facebook
                    </div>
                    <div className='loginButton github'>
                        <img src={Github} alt='' className='icon' />
                        Github
                    </div>
                </div>
                <div className='center'>
                    <div className='or'>OR</div>
                </div>
                <div className='right'>
                    <form className='w-75' onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" class="form-label">Username (*)</label>
                            <input type='text' name='username' id='username' className='form-control' onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3 col-12">
                            <label htmlFor="password" class="form-label">Password (*)</label>
                            <input type="password" className="form-control" id="password" name='password' onChange={handleInputChange} required />
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button type="submit" class="btn btn-dark btn-lg w-25">Submit</button>
                        </div>
                    </form>
                    <a href='/register' className='new-account btn btn-success'>Create new account</a>
                </div>
            </div>
        </div>
    )
}

export default Login