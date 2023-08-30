import React, { useCallback, useEffect, useState } from 'react';
import '../../styles/users/Payment.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import vnpay from '../../assets/logo/vnpay.png';
import moca from '../../assets/logo/moca.png';
import onepay from '../../assets/logo/onepay.png';
import zalopay from '../../assets/logo/zalopay.png';
import shopeepay from '../../assets/logo/shopeepay.png';
import kredivo from '../../assets/logo/kredivo.png';
import { toast } from 'react-toastify';

const Payment = (props) => {
    const { updateQuantityOrderDetail } = props;
    const location = useLocation();
    const { orderid } = location.state || {};
    const [userInfo, setUserInfo] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const navigate = useNavigate();
    const [deliveryMethod, setDeliveryMethod] = useState(``);
    const handleItemClick = useCallback((item) => {
        setSelectedItem(item);
    }, []);
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
        const getDeliveryMethod = async () => {
            await axios.get(`http://localhost:1234/get-total/${orderid}`)
                .then(res => {
                    setDeliveryMethod(res.data[0].delivery);
                }).catch(err => console.log(err));
        };
        getDeliveryMethod();
    }, [orderid]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selectedItem) {
            const checkTotal = await axios.get(`http://localhost:1234/check-total/${orderid}`);
            if (checkTotal.data[0].total > 0) {
                navigate('/');
            } else {
                if (userInfo[0].delivery === 'Pick up at the store') {
                    const requestBody = {
                        payment: selectedItem,
                        status: 'at the store'
                    };
                    try {
                        const updatePaymentRes = await axios.post(`http://localhost:1234/update-payment/${orderid}`, requestBody);
                        if (updatePaymentRes.data.payment === true) {
                            const newQuantityRes = await axios.get(`http://localhost:1234/update-product-quantity/${orderid}`);
                            if (newQuantityRes.data.update_new_product_quantity === true) {
                                updateQuantityOrderDetail();
                                navigate('/complete-order', { state: { orderid } });
                            } else {
                                toast.error(`Failed`);
                            }
                        } else {
                            toast.error(`Failed`);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                } else if (userInfo[0].delivery === 'Deliver to your home') {
                    const requestBody = {
                        payment: selectedItem,
                        status: 'delivery'
                    };
                    try {
                        const updatePaymentRes = await axios.post(`http://localhost:1234/update-payment/${orderid}`, requestBody);
                        if (updatePaymentRes.data.payment === true) {
                            const newQuantityRes = await axios.get(`http://localhost:1234/update-product-quantity/${orderid}`);
                            if (newQuantityRes.data.update_new_product_quantity === true) {
                                updateQuantityOrderDetail();
                                navigate('/complete-order', { state: { orderid } });
                            }
                            else {
                                toast.error(`Failed`);
                            }
                        } else {
                            toast.error(`Failed`);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }

        } else {
            toast.error(`Please choose a payment method !!!`);
        }
    };

    return (
        <div className='all-payment py-4'>
            <div className='payment'>
                <div className='title'>
                    <h3 className='giohang'>Payment</h3>
                </div>
                <hr />
                <div className='payment-content'>
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
                            <span className="icon-separator fw-bold fs-5">-----</span>
                            <div className='icon'>
                                <i class="fa-solid fa-box-open" style={{ border: '2px solid #222' }}></i>
                                <p>Complete order</p>
                            </div>
                        </div>
                        <div className='order-information'>
                            <div className='center d-flex flex-column'>
                                <div className='center-title w-100 text-center'><h1>Order information</h1></div>
                                {
                                    userInfo.map((user) => (
                                        <table className='table' key={user}>
                                            <tbody>
                                                <tr>
                                                    <th>Order ID:</th>
                                                    <td>{orderid}</td>
                                                </tr>
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
                        </div>
                        {
                            userInfo.map((user) => (
                                user.total !== 0 ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className='payment-method d-flex flex-column p-3'>
                                            <div className='method-item d-flex'>
                                                {
                                                    deliveryMethod === 'Deliver to your home' ? (
                                                        <div
                                                            className={`item d-flex flex-column ${selectedItem === 'Payment on delivery' ? 'selected' : ''}`}
                                                            style={{ marginRight: '4%' }}
                                                            onClick={() => handleItemClick('Payment on delivery')}
                                                        >
                                                            <div className='title'><p>Payment on delivery</p></div>
                                                            <div className='icon mx-2'><i class="fa-solid fa-truck-fast text-danger"></i></div>
                                                            <i class="fa-solid fa-circle-check"></i>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className={`item d-flex flex-column ${selectedItem === 'Payment at the store' ? 'selected' : ''}`}
                                                            style={{ marginRight: '4%' }}
                                                            onClick={() => handleItemClick('Payment at the store')}
                                                        >
                                                            <div className='title'><p>Payment at the store</p></div>
                                                            <div className='icon mx-2'><i class="fa-solid fa-store text-danger"></i></div>
                                                            <i class="fa-solid fa-circle-check"></i>
                                                        </div>
                                                    )
                                                }
                                                <div className={`item d-flex flex-column ${selectedItem === 'Transfer' ? 'selected' : ''}`} onClick={() => handleItemClick('Transfer')}>
                                                    <div className='title'><p>Transfer</p></div>
                                                    <div className='icon'><i class="fa-solid fa-money-bill-transfer text-success"></i></div>
                                                    <i class="fa-solid fa-circle-check"></i>
                                                </div>
                                            </div>
                                            <div className='method-item d-flex'>
                                                <div
                                                    className={`item d-flex flex-column ${selectedItem === 'Payment via vnpay' ? 'selected' : ''}`}
                                                    style={{ marginRight: '4%' }}
                                                    onClick={() => handleItemClick('Payment via vnpay')}
                                                >
                                                    <div className='title'><p>Payment via</p></div>
                                                    <div className='icon'><img src={vnpay} alt='' /></div>
                                                    <i class="fa-solid fa-circle-check"></i>
                                                </div>
                                                <div className={`item d-flex flex-column ${selectedItem === 'Payment via moca' ? 'selected' : ''}`} onClick={() => handleItemClick('Payment via moca')}>
                                                    <div className='title'><p>Payment via</p></div>
                                                    <div className='icon'><img src={moca} alt='' style={{ scale: '0.8' }} /></div>
                                                    <i class="fa-solid fa-circle-check"></i>
                                                </div>
                                            </div>
                                            <div className='method-item d-flex'>
                                                <div
                                                    className={`item d-flex flex-column ${selectedItem === 'Payment via onepay' ? 'selected' : ''}`}
                                                    style={{ marginRight: '4%' }}
                                                    onClick={() => handleItemClick('Payment via onepay')}
                                                >
                                                    <div className='title'><p style={{ fontSize: '0.9rem' }}>Visa/Master/JCB/Napas card payment via</p></div>
                                                    <div className='icon'><img src={onepay} alt='' style={{ scale: '3' }} /></div>
                                                    <i class="fa-solid fa-circle-check"></i>
                                                </div>
                                                <div className={`item d-flex flex-column ${selectedItem === 'Payment via zalopay' ? 'selected' : ''}`} onClick={() => handleItemClick('Payment via zalopay')}>
                                                    <div className='title'><p>Payment via</p></div>
                                                    <div className='icon'><img src={zalopay} alt='' style={{ scale: '0.8' }} /></div>
                                                    <i class="fa-solid fa-circle-check"></i>
                                                </div>
                                            </div>
                                            <div className='method-item d-flex'>
                                                <div
                                                    className={`item d-flex flex-column ${selectedItem === 'Payment via shopeepay' ? 'selected' : ''}`}
                                                    style={{ marginRight: '4%' }}
                                                    onClick={() => handleItemClick('Payment via shopeepay')}
                                                >
                                                    <div className='title'><p>Payment via</p></div>
                                                    <div className='icon'><img src={shopeepay} alt='' /></div>
                                                    <i class="fa-solid fa-circle-check"></i>
                                                </div>
                                                <div className={`item d-flex flex-column ${selectedItem === 'Payment via kredivo' ? 'selected' : ''}`} onClick={() => handleItemClick('Payment via kredivo')}>
                                                    <div className='title'><p>Payment via</p></div>
                                                    <div className='icon'> <img src={kredivo} alt='' style={{ scale: '0.8' }} /></div>
                                                    <i class="fa-solid fa-circle-check"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='payment'>
                                            <div className='button-payment'><button type="submit">Continue</button></div>
                                        </div>
                                    </form>
                                ) : <></>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment