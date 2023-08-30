import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OrderDetailAdmin = ({ scrollToTop }) => {
    const location = useLocation();
    const orderid = location.state.orderid;
    const [orderDetail, setOrderDetail] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [status, setStatus] = useState(``);
    const navigate = useNavigate();
    useEffect(() => {
        if (orderDetail.length > 0) {
            setStatus(orderDetail[0].status);
        }
    }, [orderDetail]);
    useEffect(() => {
        const getUserInfo = async () => {
            await axios.get(`http://localhost:1234/order-infor-customer/${orderid}`)
                .then(res => {
                    if (res && res.data) {
                        setUserInfo(res.data[0]);
                    }
                    else {
                        setUserInfo([]);
                    }
                }).catch(err => console.log(err));
        };
        getUserInfo();
    }, [orderid]);
    const showDetails = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:1234/show-details/${orderid}`);
            if (res && res.data) {
                setOrderDetail(res.data);
            } else {
                setOrderDetail([]);
            }
        } catch (err) {
            console.log(err);
        }
    }, [orderid]);
    useEffect(() => {
        showDetails();
    }, [showDetails]);
    const handleUpdateOrder = async () => {
        const confirm = window.confirm(`Do you confirm that the order has been finished?`);
        if (confirm) {
            await axios.get(`http://localhost:1234/update-finished-order/${orderid}`)
                .then(res => {
                    if (res && res.data.updateOrder === true) {
                        alert(`Order update successful !!!`);
                        showDetails();
                        scrollToTop();
                    }
                })
        }
    }
    const handleDeleteOrder = async () => {
        const confirm = window.confirm(`Are you sure you want to delete this canceled order?`);
        if (confirm) {
            await axios.delete(`http://localhost:1234/delete-cancel-order/${orderid}`)
                .then(res => {
                    if (res && res.data.deleteOrder === true) {
                        alert(`Delete this canceled order successfully !!!`);
                        navigate(`/order-admin`);
                    }
                })
        }
    }
    const dateTime = new Date();
    const formattedDateTime = dateTime.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    let totalCost = 0;
    return (
        <div className='all-orderdetail py-4'>
            <div className='orderdetail'>
                <div className='title'>
                    <Link to={`/order-admin`}><h3 className='back'>Back</h3></Link>
                    <h3 className='giohang'>Order Detail Admin</h3>
                </div>
                <div className='info-orderdetail d-flex justify-content-between'>
                    {orderDetail.length > 0 ? (
                        <>
                            <div className='left'>
                                <div className='orderid'>OrderID: <b>{orderDetail[0].orderid}</b></div>
                                <div className='date'>{formattedDateTime}</div>
                            </div>
                            <div className='right d-flex flex-column'>
                                {
                                    orderDetail[0].status === 'delivery' || orderDetail[0].status === 'at the store' ?
                                        <>
                                            <b className='p-2 bg-secondary text-light'>{orderDetail[0].status.charAt(0).toUpperCase() + orderDetail[0].status.slice(1)}</b>
                                        </> :
                                        orderDetail[0].status === 'canceled' ?
                                            <b className='border p-2 bg-danger text-light'>{orderDetail[0].status.charAt(0).toUpperCase() + orderDetail[0].status.slice(1)}</b> :
                                            <b className='border p-2 bg-success text-light'>{orderDetail[0].status.charAt(0).toUpperCase() + orderDetail[0].status.slice(1)}</b>
                                }
                            </div>
                        </>
                    ) : null}
                </div>
                <hr />

                <div className='card d-flex flex-column p-2'>
                    {
                        orderDetail.length > 0 ? orderDetail.map((order) => {
                            const subTotal = order.quantity * order.price;
                            return (
                                <div className='card-orderdetail my-2 d-flex' key={order.orderid}>
                                    <div className='card-image my-2'>
                                        <img src={`http://localhost:1234/images/${order.image}`} alt='' />
                                    </div>
                                    <div className='card-content d-flex flex-column mx-3 my-2'>
                                        <div className='card-name'><b>{order.name}</b></div>
                                        <div className='price-cost d-flex'>
                                            <div className='price-title'>Price:</div>
                                            <div className='price mx-2 fw-bold'>{order.price.toLocaleString()}đ</div>
                                            <div className='cost mx-1'>{order.cost.toLocaleString()}đ</div>
                                        </div>
                                        <div className='card-quantity d-flex'>
                                            <div className='quantity-title'>Quantity:</div>
                                            <div className='quantity fw-bold mx-2'>{order.quantity}</div>
                                        </div>
                                        <div className='card-subtotal d-flex'>
                                            <div className='subtotal-title'>Subtotal:</div>
                                            <div className='subtotal mx-2 fw-bold'>{subTotal.toLocaleString()}đ</div>
                                        </div>
                                    </div>
                                    <div className='feature d-flex flex-column'>
                                        <div className='item'><p>{order.colorname}</p></div>
                                        <div className='item'><p>{order.memoryname}</p></div>
                                    </div>
                                </div>
                            )
                        }) : <h3 className='text-center text-danger'>Product does not exist!!!</h3>
                    }
                </div>
                <div className='info-payment d-flex flex-column p-2'>
                    <div class="title my-2 mx-2">
                        <p><i class="fa-solid fa-money-check-dollar"></i>    Payment information</p>
                    </div>


                    {
                        orderDetail.length > 0 && (
                            <table className='table '>
                                <tr>
                                    <th>Total price:</th>
                                    <td>{
                                        orderDetail.map((order) => {
                                            totalCost += order.cost * order.quantity;
                                            return <></>
                                        })
                                    }{totalCost.toLocaleString()}đ</td>
                                </tr>
                                <tr>
                                    <th>Total discount:</th>
                                    <td>{
                                        orderDetail.map((order) => {
                                            totalCost += order.cost * order.quantity;
                                            return <></>
                                        })
                                    } {(totalCost / 2 - orderDetail[0].total).toLocaleString()}đ</td>
                                </tr>
                                <tr>
                                    <th>Transport fee:</th>
                                    <td>Free</td>
                                </tr>
                                <tr>
                                    <td colspan="4">
                                        <div class="hr-container">
                                            <div class="hr-line"></div>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <th>Have to pay:</th>
                                    <td>{orderDetail[0].total.toLocaleString()}đ</td>
                                </tr>
                            </table>
                        )
                    }
                </div>
                <div className='info-customer d-flex flex-column p-2'>
                    <div class="title my-2 mx-2">
                        <p><i class="fa-solid fa-circle-info"></i>    Customer information</p>
                    </div>
                    <div className='content mx-2'>
                        <p><i class="fa-solid fa-user"></i> {userInfo.name}</p>
                        <p><i class="fa-solid fa-phone"></i> {userInfo.phonenumber}</p>
                        <p><i class="fa-solid fa-location-dot"></i> {userInfo.address}</p>
                    </div>
                </div>
                <div className='action-admin d-flex'>
                    {
                        status === 'delivery' || status === 'at the store' ?
                            (
                                <p className='btn btn-primary' onClick={() => handleUpdateOrder()}>Update</p>
                            ) : status === 'canceled' ?
                                (
                                    <p className='btn btn-danger' onClick={() => handleDeleteOrder()}>Delete</p>
                                ) :
                                (
                                    <p className='btn btn-success' onClick={() => alert(`This order has been finished !!!`)}>Finished</p>
                                )
                    }
                </div>
            </div>
        </div>
    )
}

export default OrderDetailAdmin