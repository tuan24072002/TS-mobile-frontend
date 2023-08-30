import React, { useEffect, useState } from 'react'
import '../../styles/users/CompleteOrder.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompleteOrder = () => {
    const location = useLocation();
    // const [orderid, setOrderid] = useState('');
    const orderid = location.state.orderid;
    const [userInfo, setUserInfo] = useState([]);
    const [cart, setCart] = useState([]);
    // useEffect(() => {

    //     setOrderid(orderid);
    // }, [setOrderid, location.state]);
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
    useEffect(() => {
        const getAll = async () => {
            try {
                const res = await axios.get(`http://localhost:1234/get-all-orderdetail/${orderid}`);
                setCart(res.data);
            } catch (error) {
                console.error("Error fetching order detail:", error);
            }
        };
        getAll();
    }, [orderid]);
    const navigate = useNavigate();
    const handleCheckOrder = () => {
        navigate('/order-detail', { state: { orderid } })
    }
    return (
        <div className='all-complete py-4'>
            <div className='complete'>
                <div className='title'>
                    <h3 className='giohang'>Complete Order</h3>
                </div>
                <hr />
                <div className='complete-content'>
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
                            <span className="icon-separator text-danger fw-bold fs-5">-----</span>
                            <div className='icon text-danger'>
                                <i class="fa-solid fa-credit-card" style={{ border: '2px solid red' }}></i>
                                <p>Payment</p>
                            </div>
                            <span className="icon-separator text-danger fw-bold fs-5">-----</span>
                            <div className='icon text-danger'>
                                <i class="fa-solid fa-box-open" style={{ border: '2px solid red' }}></i>
                                <p>Complete order</p>
                            </div>
                        </div>
                        {
                            userInfo.length !== 0 ? (
                                <div className='complete-order d-flex flex-column p-3'>
                                    <div className='title'>ORDER SUCCESSFULLY</div>
                                    {
                                        userInfo.map((user) => (
                                            <table className='table table-white  my-2' key={user}>
                                                <tbody>
                                                    <tr>
                                                        <td>Order ID:</td>
                                                        <th>{orderid}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>Name:</td>
                                                        <th>{user.name}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>Phonenumber:</td>
                                                        <th>{user.phonenumber}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>Email:</td>
                                                        <th>{user.email}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>Delivery:</td>
                                                        <th>{user.address}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>Payment method:</td>
                                                        <th>{user.payment}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>Total price:</td>
                                                        <th className='text-danger' style={{ fontWeight: 'bold' }}>{user.total.toLocaleString()}đ</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        ))
                                    }
                                </div>
                            ) : <div className='fail-order d-flex flex-column p-3'>
                                <div className='title'>ORDER FAIL</div>
                            </div>
                        }
                        <div className='card d-flex flex-column p-2'>
                            {
                                cart.map((value) => {
                                    const subTotal = value.quantity * value.price;
                                    return (
                                        <div className='card-complete my-2 d-flex' key={value.productid}>
                                            <div className='card-image my-2'>
                                                <img src={`http://localhost:1234/images/${value.image}`} alt='' />
                                            </div>
                                            <div className='card-content d-flex flex-column mx-3 my-2'>
                                                <div className='card-name'><b>{value.name}</b></div>
                                                <div className='price-cost d-flex'>
                                                    <div className='price-title'>Price:</div>
                                                    <div className='price mx-2 fw-bold'>{value.price.toLocaleString()}đ</div>
                                                    <div className='cost mx-1'>{value.cost.toLocaleString()}đ</div>
                                                </div>
                                                <div className='card-quantity d-flex'>
                                                    <div className='quantity-title'>Quantity:</div>
                                                    <div className='quantity fw-bold mx-2'>{value.quantity}</div>
                                                </div>
                                                <div className='card-subtotal d-flex'>
                                                    <div className='subtotal-title'>Subtotal:</div>
                                                    <div className='subtotal mx-2 fw-bold'>{subTotal.toLocaleString()}đ</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='action d-flex p-2'>
                            <div className='check-order btn btn-primary p-3 d-flex flex-column' onClick={handleCheckOrder}>
                                <div className='title'>
                                    Check your order
                                </div>
                                <div className='icon my-1'>
                                    <i class="fa-solid fa-circle-check"></i>
                                </div>
                            </div>
                            <div className='continue-shoping'>
                                <Link to={'/'} className='btn btn-danger p-3 d-flex flex-column'>
                                    <div className='title'>
                                        Continue shopping
                                    </div>
                                    <div className='icon my-1'>
                                        <i class="fa-solid fa-cart-plus"></i>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CompleteOrder