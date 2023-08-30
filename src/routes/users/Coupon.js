import React, { useEffect, useState } from 'react'
import '../../styles/users/Coupon.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';

const Coupon = () => {
    const location = useLocation();
    const { orderid } = location.state || {};
    const [userInfo, setUserInfo] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const getUserInfo = async () => {
            await axios.get(`http://localhost:1234/order-infor-customer/${orderid}`)
                .then(res => {
                    if (res && res.data) {
                        setUserInfo(res.data);
                    } else {
                        setUserInfo([]);
                    }
                })
        }
        getUserInfo();
    }, [orderid]);
    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/payment', { state: { orderid } });
        // navigate(`/payment/${orderid}`);
    }
    return (
        <div className='all-coupon py-4'>
            <div className='coupon'>
                <div className='title'>
                    <a href={`/order-information`}><h3 className='back'>Back</h3></a>
                    <h3 className='giohang'>Coupons</h3>
                </div>
                <hr />
                <div className='coupon-content'>
                    <div className='content'>
                        <div className='top'>
                            <div className='icon text-danger'>
                                <i className="fa-solid fa-cart-shopping" style={{ border: '2px solid red' }}></i>
                                <p>Select product</p>
                            </div>
                            <span className="icon-separator text-danger fw-bold fs-5">-----</span>
                            <div className='icon text-danger'>
                                <i class="fa-solid fa-address-card" style={{ border: '2px solid red' }}></i>
                                <p>Order information</p>
                            </div>
                            <span className="icon-separator text-danger fw-bold fs-5">-----</span>
                            <div className='icon text-danger'>
                                <i class="fa-solid fa-ticket" style={{ border: '2px solid red' }}></i>
                                <p>Coupons</p>
                            </div>
                            <span className="icon-separator fw-bold fs-5">-----</span>
                            <div className='icon'>
                                <i class="fa-solid fa-credit-card" style={{ border: '2px solid #222' }}></i>
                                <p>Payment</p>
                            </div>
                            <span className="icon-separator fw-bold fs-5">-----</span>
                            <div className='icon'>
                                <i class="fa-solid fa-box-open" style={{ border: '2px solid #222' }}></i>
                                <p>Complete order</p>
                            </div>
                        </div>
                        <form className='form w-100 d-flex flex-column' onSubmit={handleSubmit}>
                            <div className='fill-coupon mb-3'>
                                <form className='d-flex p-2 justify-content-center'>
                                    <input type='text' name='coupon' id='coupon' className='form-control mx-2' placeholder='Have coupon?' required />
                                    <button className='btn btn-danger'>Apply</button>
                                </form>
                            </div>
                            <div className='center d-flex flex-column'>
                                <div className='center-title w-100 text-center'><h1>Order information</h1></div>
                                {
                                    userInfo.map((user) => (
                                        <table className='table' key={user}>
                                            <tbody>
                                                <tr>
                                                    <th>Name:</th>
                                                    <td>{user.name}</td>
                                                </tr>
                                                <tr>
                                                    <th>Phonenumber:</th>
                                                    <td>{user.phonenumber}</td>
                                                </tr>
                                                <tr>
                                                    <th>Email:</th>
                                                    <td>{user.email}</td>
                                                </tr>
                                                <tr>
                                                    <th>Delivery:</th>
                                                    <td>{user.address}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total price:</th>
                                                    <td className='text-danger' style={{ fontWeight: 'bold' }}>{user.total.toLocaleString()}đ</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    ))
                                }
                            </div>
                            {
                                userInfo.map((user) => user.total !== 0 ? (
                                    <div className='payment d-flex flex-column'>
                                        <div className='button-payment'><button type="submit">Continue</button></div>
                                        <Link to={'/product'} style={{ textDecoration: 'none', color: '#222' }}><div className='button-buy'><button>Choose more products</button></div></Link>
                                    </div>
                                ) : <></>
                                )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Coupon