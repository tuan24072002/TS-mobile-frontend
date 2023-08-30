import React from 'react'
import { Link } from 'react-router-dom'
import './SideBar.scss';
import axios from 'axios';

const handleLogout = async () => {
    try {
        await axios.get('http://localhost:1234/logout')
            .then(res => {
                window.location.replace('/');
            }).catch(err => console.log(err));
    } catch (err) {
        console.log(err);
    }
};
const SideBar = () => {
    return (
        <div className='all-sidebar bg-white p-2 sidebar '>
            <div className='p-2'>
                <i className='bi bi-bootstrap-fill me-3 fs-4'></i>
                <span className='brand-name fs-4'>Admin Page</span>
            </div>
            <hr className='text-dark' />
            <div className='list-group list-group-flush'>
                {/* <Link to={'/admin'} className='list-group-item py-2 '>
                    <i className='bi bi-speedometer2 fs-5 me-3'></i>
                    <span className='fs-5'>Dashboard</span>
                </Link> */}
                <Link to={'/admin'} className='list-group-item py-2 '>
                    <i className='bi bi-house fs-5 me-3'></i>
                    <span className='fs-5'>Home</span>
                </Link>
                <Link to={'/product-admin'} className='list-group-item py-2 '>
                    <i className='bi bi-table fs-5 me-3'></i>
                    <span className='fs-5'>Product</span>
                </Link>
                <Link to={'/order-admin'} className='list-group-item py-2 '>
                    <i className='bi bi-clipboard-data fs-5 me-3'></i>
                    <span className='fs-5'>Order</span>
                </Link>
                <Link to={'/user-admin'} className='list-group-item py-2 '>
                    <i className='bi bi-people fs-5 me-3'></i>
                    <span className='fs-5'>Users</span>
                </Link>
                <Link to={'/blacklist'} className='list-group-item py-2 '>
                    <i class="bi bi-person-lock fs-5 me-3"></i>
                    <span className='fs-5'>Blacklist</span>
                </Link>
                <Link to={'#'} className='list-group-item py-2 ' onClick={handleLogout}>
                    <i className='bi bi-power fs-5 me-3'></i>
                    <span className='fs-5'>Logout</span>
                </Link>
            </div>
        </div>
    )
}

export default SideBar