import React, { useCallback, useEffect, useState } from 'react'
import '../../styles/users/OrderManagement.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderCheck = ({ username }) => {
    axios.defaults.withCredentials = true;
    const [allOrder, setAllOrder] = useState([]);
    const [orderCancel, setOrderCancel] = useState([]);
    const [orderReceived, setOrderReceived] = useState([]);
    const [orderDelivery, setOrderDelivery] = useState([]);
    const [orderConfirm, setOrderConfirm] = useState([]);
    const [orderUnconfirm, setOrderUnconfirm] = useState([]);
    const [selectedItem, setSelectedItem] = useState(0);
    const [orderQuantity, setOrderQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const handleItemClick = useCallback((item) => {
        setSelectedItem(item);
    }, []);
    useEffect(() => {
        const orderQuantity = async () => {
            await axios.get(`http://localhost:1234/order-quantity/${username}`)
                .then(res => {
                    if (res && res.data) {
                        setOrderQuantity(res.data[0].orderQuantity);
                    } else {
                        setOrderQuantity(0);
                    }
                }).catch(err => console.log(err));
        }
        orderQuantity();
    }, [username]);
    useEffect(() => {
        const totalPrice = async () => {
            await axios.get(`http://localhost:1234/sum-totalprice/${username}`)
                .then(res => {
                    if (res && res.data) {
                        setTotalPrice(res.data[0].total);
                    } else {
                        setTotalPrice(0);
                    }
                }).catch(err => console.log(err));
        }
        totalPrice();
    }, [username]);
    useEffect(() => {
        const getAllOrder = async () => {
            await axios.get(`http://localhost:1234/get-all-order/${username}`)
                .then(res => {
                    if (res && res.data) {
                        setAllOrder(res.data);
                    }
                }).catch(err => console.log(err));
        }
        getAllOrder();
    }, [username]);
    useEffect(() => {
        const getOrderUnconfirm = async () => {
            await axios.get(`http://localhost:1234/get-order-unconfirm/${username}`)
                .then(res => {
                    if (res && res.data) {
                        setOrderUnconfirm(res.data);
                    }
                }).catch(err => console.log(err));
        }
        getOrderUnconfirm();
    }, [username]);
    useEffect(() => {
        const getOrderConfirm = async () => {
            await axios.get(`http://localhost:1234/get-order-confirm/${username}`)
                .then(res => {
                    if (res && res.data) {
                        setOrderConfirm(res.data);
                    }
                }).catch(err => console.log(err));
        }
        getOrderConfirm();
    }, [username]);
    useEffect(() => {
        const getOrderDelivery = async () => {
            await axios.get(`http://localhost:1234/get-order-delivery/${username}`)
                .then(res => {
                    if (res && res.data) {
                        setOrderDelivery(res.data);
                    }
                }).catch(err => console.log(err));
        }
        getOrderDelivery();
    }, [username]);
    useEffect(() => {
        const getOrderDelivery = async () => {
            await axios.get(`http://localhost:1234/get-order-received/${username}`)
                .then(res => {
                    if (res && res.data) {
                        setOrderReceived(res.data);
                    }
                }).catch(err => console.log(err));
        }
        getOrderDelivery();
    }, [username]);
    useEffect(() => {
        const getOrderDelivery = async () => {
            await axios.get(`http://localhost:1234/get-order-cancel/${username}`)
                .then(res => {
                    if (res && res.data) {
                        setOrderCancel(res.data);
                    }
                }).catch(err => console.log(err));
        }
        getOrderDelivery();
    }, [username]);
    const handleClickSeeDetails = (orderid) => {
        navigate('/order-detail', { state: { orderid } });
    };
    const orderArrays = [allOrder, orderUnconfirm, orderConfirm, orderDelivery, orderReceived, orderCancel];
    const selectedOrders = orderArrays[selectedItem];
    return (
        username !== '' ? (
            <div className='all-manage d-flex vh-100 bg-white align-items-center flex-column'>
                <div className='manage w-75 border mt-5'>
                    <div className='title d-flex flex-column'>
                        <p className='title-item text-center'>ORDER HISTORY</p>
                        <div className='parameter d-flex justify-content-center'>
                            <div className='parameter-item d-flex flex-column text-center'>
                                <i class="fa-solid fa-truck-fast"></i>
                                <p>{orderQuantity} orders</p>
                            </div>
                            <div className='parameter-item d-flex flex-column text-center'>
                                <i class="fa-solid fa-wallet"></i>
                                <p>{totalPrice.toLocaleString()}đ</p>
                            </div>
                        </div>
                    </div>
                    <div className='menu d-flex my-2'>
                        <div className={`menu-item ${selectedItem === 0 ? 'selected' : ''}`} onClick={() => handleItemClick(0)}>All</div>
                        <div className={`menu-item ${selectedItem === 1 ? 'selected' : ''}`} onClick={() => handleItemClick(1)}>Unconfirmed</div>
                        <div className={`menu-item ${selectedItem === 2 ? 'selected' : ''}`} onClick={() => handleItemClick(2)}>Confirmed</div>
                        <div className={`menu-item ${selectedItem === 3 ? 'selected' : ''}`} onClick={() => handleItemClick(3)}>Delivery</div>
                        <div className={`menu-item ${selectedItem === 4 ? 'selected' : ''}`} onClick={() => handleItemClick(4)}>Received</div>
                        <div className={`menu-item ${selectedItem === 5 ? 'selected' : ''}`} onClick={() => handleItemClick(5)}>Canceled</div>
                    </div>
                    <div className='list-order my-5'>
                        <table className={`table table-${selectedItem === 0 ? 'light' : selectedItem === 1 ? 'primary' : selectedItem === 2 ? 'secondary' : selectedItem === 3 ? 'info' : selectedItem === 4 ? 'success' : 'danger'}`}>
                            <thead>
                                <tr className='text-center'>
                                    <th>OrderID</th>
                                    <th>Date</th>
                                    <th>State</th>
                                    <th>Total Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            {
                                selectedOrders.map((allorder) => {
                                    const dateTime = new Date(allorder.date);
                                    const formattedDateTime = dateTime.toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    });
                                    return (
                                        <tbody className='text-center' key={allorder.orderid}>
                                            <tr>
                                                <td>{allorder.orderid}</td>
                                                <td>{formattedDateTime !== '01/01/1970, 08:00:00' ? formattedDateTime : ''}</td>
                                                <td>{allorder.status}</td>
                                                <td>{allorder.total.toLocaleString()}đ</td>
                                                <td>
                                                    {
                                                        allorder.status !== 'unfinished' ? (
                                                            <button className={`btn btn-primary`} onClick={() => handleClickSeeDetails(allorder.orderid)}>See details</button>
                                                        ) : <></>
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })
                            }
                        </table>
                    </div>
                </div>
            </div>
        ) :
            <div className='all-info d-flex vh-100 justify-content-center align-items-center flex-column'>
                <h1 className='text-danger'>404 !</h1>
                <p className='fw-bold text-danger'>Page does not exist</p>
            </div>
    )
}

export default OrderCheck