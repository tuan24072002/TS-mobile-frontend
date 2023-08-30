import React from 'react'
import SideBar from '../../components/admin/SideBar';

const Home = () => {
    return (
        <div className='all-admin'>
            <div className='container-fluid bg-white'>
                <div className='row'>
                    <div className='col-2 bg-white border'>
                        <SideBar />
                    </div>
                    <div className='col-10 p-0'>
                        <div className='all-home-admin d-flex vh-100 justify-content-center align-items-center bg-white'>
                            <div className='p-3 bg-secondary w-50'>
                                <h1 className='text-center text-light'>Welcome to Admin Page!!!</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Home