import React, { useCallback, useEffect, useRef, useState } from 'react'
import '../../styles/users/InfoCustomer.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageDoseNotExist from '../Page_Does_Not_Exist/PageDoseNotExist';

const InfoCustomer = ({ username, updateName, updateAvatar }) => {
  const [userInfo, setUserInfo] = useState([]);
  const fileInputRef = useRef(null);
  const handleInputChange = (event) => {
    setUserInfo(prev => ({ ...prev, [event.target.name]: event.target.value }))
  };
  const getUserInfo = useCallback(async () => {
    await axios.get(`http://localhost:1234/user-by-username/${username}`)
      .then(res => {
        if (res && res.data) {
          setUserInfo(res.data[0]);
        }
        else {
          setUserInfo([]);
        }
      }).catch(err => setUserInfo([]));
  }, [username]);
  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestBody = {
      name: userInfo.name,
      phonenumber: userInfo.phonenumber,
      email: userInfo.email,
      address: userInfo.address,
    };
    const res = await axios.post(`http://localhost:1234/update-user/${username}`, requestBody);
    if (res && res.data.update_user === true) {
      toast.success('Update user sucessfully !!!');
      updateName();
    } else {
      toast.error('Update user failed !!!');
    }
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleUpload(file);
  };
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    axios.post(`http://localhost:1234/upload-avatar/${username}`, formData)
      .then(res => {
        if (res && res.data.upload_avatar === true) {
          console.log('Successfully ~~~');
          getUserInfo();
          updateAvatar();
        } else {
          console.log('Failed !!!');
        }

      })
      .catch(err => console.log(err));
  }
  return (
    <>
      {
        userInfo.length !== 0 ? (
          <div className='all-info d-flex vh-100 justify-content-center align-items-center'>
            <div className='info p-3 w-50'>
              <form onSubmit={handleSubmit}>
                <Link to={'/'} className='btn-back btn btn-warning'>Back</Link>
                <div className='title'><p className='text-center fw-bold'>Information Customer</p></div>
                <div className='mb-3 fs-4'>
                  <p>Username: <b>{userInfo.username}</b></p>
                </div>
                <div className='row'>
                  <div className='mb-3 col-6'>
                    <label htmlFor='name' className='fw-bold'>Name</label>
                    <input type='text' name='name' value={userInfo.name} onChange={handleInputChange} className='form-control' placeholder='Enter your Name' required />
                  </div>
                  <div className='mb-3 col-6'>
                    <label htmlFor='phonenumber' className='fw-bold'>Phonenumber</label>
                    <input type='number' name='phonenumber' value={userInfo.phonenumber} onChange={handleInputChange} className='form-control' placeholder='Enter your Phonenumber' required />
                  </div>
                </div>
                <div className='row'>
                  <div className='mb-3 col-6'>
                    <label htmlFor='email' className='fw-bold'>Email</label>
                    <input type='email' name='email' value={userInfo.email} onChange={handleInputChange} className='form-control' placeholder='Enter your Email' required />
                  </div>
                  <div className='mb-3 col-6'>
                    <label htmlFor='address' className='fw-bold'>Address</label>
                    <input type='text' name='address' value={userInfo.address} onChange={handleInputChange} className='form-control' placeholder='Enter your Address' required />
                  </div>
                </div>
                <div className='mb-3'>
                  <label htmlFor='address' className='fw-bold'>Image</label>
                  {
                    userInfo.avatar !== null ? (
                      <div className='avatar'>
                        <img
                          src={`http://localhost:1234/avatar/${userInfo.avatar}`}
                          alt=''
                        />
                        <input
                          type='file'
                          name='file'
                          className='form-control'
                          style={{ display: 'none' }}
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                        <div className='change-image border fs-5' onClick={handleImageClick}>Change avatar</div>
                      </div>
                    ) : <>
                      <input type='file' name='file' className='form-control' onChange={handleFileChange} />
                      <Link className='btn btn-secondary' onClick={handleUpload}>Upload</Link>
                    </>
                  }
                </div>
                <button type='submit' className='btn btn-dark w-25'>Save</button>
              </form>
            </div>
          </div >
        ) : userInfo.length === 0 &&
        <PageDoseNotExist />
      }
    </>
  )
}

export default InfoCustomer