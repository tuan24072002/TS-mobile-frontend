import React, { useCallback, useEffect, useState } from 'react'
import '../../styles/users/OrderDetail.scss';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageDoseNotExist from '../Page_Does_Not_Exist/PageDoseNotExist';

const OrderDetail = ({ updateQuantityOrderDetail }) => {
    const location = useLocation();
    const orderid = location.state && location.state.orderid;
    const [orderDetail, setOrderDetail] = useState([]);
    const [getOrderid, setOrderid] = useState('');
    const [username, setUsername] = useState('');
    const [userInfo, setUserInfo] = useState([]);

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

    const getOrderID = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:1234/check-order-exist/${username}`);
            if (res.data && res.data.length > 0) {
                setOrderid(res.data[0].orderid);
            } else {
                await axios.get(`http://localhost:1234/add-order/${username}`)
                    .then(addorder => {
                        if (addorder) {
                            setOrderid(addorder.data.orderid);
                        } else {
                            setOrderid('');
                        }
                    }).catch(errAddOrder => console.log(errAddOrder));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }, [username]);
    useEffect(() => {
        getOrderID();
    }, [getOrderID]);
    useEffect(() => {
        const getUsername = async () => {
            axios.get('http://localhost:1234/')
                .then(res => {
                    if (res.data.success === true) {
                        setUsername(res.data.username);
                    } else {
                        setUsername('');
                    }
                })
        }
        getUsername();
    }, []);


    const handleCancelOrder = async () => {
        const res = await axios.get(`http://localhost:1234/cancel-order/${orderid}`);
        if (res && res.data.cancel === true) {
            toast.success('Cancel order successfully !!!');
            showDetails();
        } else {
            toast.error(`Cancel order failed !!!`);
        }
    }
    const handleBuyAllAgain = async () => {
        try {
            getOrderID();
            orderDetail.forEach((product) => {
                const productid = product.id;
                const price = product.price;
                axios.get(`http://localhost:1234/check-product-exist/${getOrderid}/${productid}`)
                    .then(checkProductExist => {
                        if (checkProductExist && checkProductExist.data.length > 0) {
                            axios.get(`http://localhost:1234/increase-quantity/${getOrderid}/${productid}`)
                                .then(increaseQuantity => {
                                    if (increaseQuantity && increaseQuantity.data.result === true && increaseQuantity.data.message === 'Quantity increased successfully') {
                                        toast.success('Increase quantity successfully!!!');
                                        updateQuantityOrderDetail();
                                    } else if (increaseQuantity && increaseQuantity.data.result === true && increaseQuantity.data.message === 'Quantity has reached the limit') {
                                        toast.warning('Quantity has reached the limit, if you want to buy more, please contact 0587928264');
                                        // setShowModalWarning(true);
                                    }
                                    else {
                                        toast.error('Failed to increase quantity!!!');
                                    }
                                }).catch(errIncreaseQuantity => console.log(errIncreaseQuantity));
                        } else {
                            axios.post('http://localhost:1234/add-order-detail', { orderid: getOrderid, productid, price })
                                .then(addOrderDetail => {
                                    if (addOrderDetail && addOrderDetail.data.result === true) {
                                        toast.success('Add to cart successfully!!!');
                                        updateQuantityOrderDetail();
                                    } else {
                                        toast.error('Failed to add to cart!!!');
                                    }
                                }).catch(errAddOrderDetail => console.log(errAddOrderDetail));
                        }
                    }).catch(errCheckProductExist => console.log(errCheckProductExist));
            });
        } catch (error) {
            console.error('Error fetching order quantity:', error);
        }
    }
    const handleAddtoCart = async (productid, price) => {
        try {
            getOrderID();
            axios.get(`http://localhost:1234/check-product-exist/${getOrderid}/${productid}`)
                .then(checkProductExist => {
                    if (checkProductExist && checkProductExist.data.length > 0) {
                        axios.get(`http://localhost:1234/increase-quantity/${getOrderid}/${productid}`)
                            .then(increaseQuantity => {
                                if (increaseQuantity && increaseQuantity.data.result === true && increaseQuantity.data.message === 'Quantity increased successfully') {
                                    toast.success('Increase quantity successfully!!!');
                                    updateQuantityOrderDetail();
                                } else if (increaseQuantity && increaseQuantity.data.result === true && increaseQuantity.data.message === 'Quantity has reached the limit') {
                                    toast.warning('Quantity has reached the limit, if you want to buy more, please contact 0587928264');
                                    // setShowModalWarning(true);
                                }
                                else {
                                    toast.error('Failed to increase quantity!!!');
                                }
                            }).catch(errIncreaseQuantity => console.log(errIncreaseQuantity));
                    } else {
                        axios.post('http://localhost:1234/add-order-detail', { orderid: getOrderid, productid, price })
                            .then(addOrderDetail => {
                                if (addOrderDetail && addOrderDetail.data.result === true) {
                                    toast.success('Add to cart successfully!!!');
                                    updateQuantityOrderDetail();
                                } else {
                                    toast.error('Failed to add to cart!!!');
                                }
                            }).catch(errAddOrderDetail => console.log(errAddOrderDetail));
                    }
                }).catch(errCheckProductExist => console.log(errCheckProductExist));
        } catch (error) {
            console.error('Error fetching order quantity:', error);
        }
    };
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
        orderDetail.length !== 0 && location.state.orderid ?
            (
                <div className='all-orderdetail py-4'>
                    <div className='orderdetail'>
                        <div className='title'>
                            <Link to={`/order-management`}><h3 className='back'>Back</h3></Link>
                            <h3 className='giohang'>Order Detail</h3>
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
                                            <button onClick={() => handleAddtoCart(order.id, order.price)}>Buy again</button>
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
                        {
                            orderDetail.length > 0 && (
                                <div className='clearfix'>
                                    {
                                        orderDetail[0].status === 'at the store' || orderDetail[0].status === 'delivery' ? (
                                            <div className='cancel-order my-2 border' style={{ float: 'right' }}>
                                                <button className='btn btn-danger hover' onClick={() => handleCancelOrder()}>Cancel order</button>
                                            </div>
                                        ) : orderDetail[0].status === 'canceled' || orderDetail[0].status === 'finished' ? (
                                            <div className='cancel-order my-2 border' style={{ float: 'right' }}>
                                                <button className='btn btn-primary hover' onClick={() => handleBuyAllAgain()}>Buy all again</button>
                                            </div>
                                        ) : <></>
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            ) : (<PageDoseNotExist />)
    )
}

export default OrderDetail