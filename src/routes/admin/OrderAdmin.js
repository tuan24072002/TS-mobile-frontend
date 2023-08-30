import React, { useCallback, useEffect, useState } from 'react'
import '../../styles/admin/OrderAdmin.scss'
import SideBar from '../../components/admin/SideBar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const OrderManagement = () => {
    const navigate = useNavigate();
    const [allOrderAdmin, setAllOrderAdmin] = useState([]);
    const [sortOrderID, setSortOrderID] = useState(null);
    const [sortUsername, setSortUsername] = useState(null);
    const [sortDate, setSortDate] = useState(null);
    const [sortTotal, setSortTotal] = useState(null);
    const [sortDelivery, setSortDelivery] = useState(null);
    const [sortPayment, setSortPayment] = useState(null);
    const [sortName, setSortName] = useState(null);
    const [sortAddress, setSortAddress] = useState(null);
    const [sortStatus, setSortStatus] = useState(null);
    const getAllOrder = useCallback(
        async () => {
            await axios.get(`http://localhost:1234/get-all-order-admin`)
                .then(res => {
                    if (res && res.data) {
                        setAllOrderAdmin(res.data);
                    }
                }).catch(err => console.log(err));
        }, []
    )
    useEffect(() => {
        getAllOrder();
    }, [getAllOrder]);
    const handleUpdateOrder = async (orderid) => {
        const confirm = window.confirm(`Do you confirm that the order has been finished?`);
        if (confirm) {
            await axios.get(`http://localhost:1234/update-finished-order/${orderid}`)
                .then(res => {
                    if (res && res.data.updateOrder === true) {
                        alert(`Order update successful !!!`);
                        getAllOrder();
                    }
                })
        }
    }
    const handleDeleteOrder = async (orderid) => {
        const confirm = window.confirm(`Are you sure you want to delete this canceled order?`);
        if (confirm) {
            await axios.delete(`http://localhost:1234/delete-cancel-order/${orderid}`)
                .then(res => {
                    if (res && res.data.deleteOrder === true) {
                        alert(`Delete this canceled order successfully !!!`);
                        getAllOrder();
                    }
                })
        }
    }
    const handleClickSeeDetails = (orderid) => {
        navigate('/order-detail-admin', { state: { orderid } });
    };
    let revenue = 0;
    let orderCount = 0;
    let store = 0;
    let delivery = 0;
    let finished = 0;
    const handleSort = (sortField) => {
        setSortOrderID(null);
        setSortUsername(null);
        setSortDate(null);
        setSortTotal(null);
        setSortDelivery(null);
        setSortPayment(null);
        setSortName(null);
        setSortAddress(null);
        setSortStatus(null);

        let sortOrder = null;
        if (sortField === 'orderid') sortOrder = sortOrderID;
        if (sortField === 'username') sortOrder = sortUsername;
        if (sortField === 'date') sortOrder = sortDate;
        if (sortField === 'total') sortOrder = sortTotal;
        if (sortField === 'delivery') sortOrder = sortDelivery;
        if (sortField === 'payment') sortOrder = sortPayment;
        if (sortField === 'name') sortOrder = sortName;
        if (sortField === 'address') sortOrder = sortAddress;
        if (sortField === 'status') sortOrder = sortStatus;


        if (sortOrder === null) {
            sortOrder = true;
        } else if (sortOrder === true) {
            sortOrder = false;
        } else {
            sortOrder = null;
        }
        if (sortOrder !== null) {
            axios.get(`http://localhost:1234/get-all-order-admin-sort/${sortField}/${sortOrder ? 'asc' : 'desc'}`)
                .then(res => {
                    if (res) {
                        setAllOrderAdmin(res.data);
                        if (sortField === 'orderid') setSortOrderID(sortOrder);
                        if (sortField === 'username') setSortUsername(sortOrder);
                        if (sortField === 'date') setSortDate(sortOrder);
                        if (sortField === 'total') setSortTotal(sortOrder);
                        if (sortField === 'delivery') setSortDelivery(sortOrder);
                        if (sortField === 'payment') setSortPayment(sortOrder);
                        if (sortField === 'name') setSortName(sortOrder);
                        if (sortField === 'address') setSortAddress(sortOrder);
                        if (sortField === 'status') setSortStatus(sortOrder);
                    }
                }).catch(err => console.log(err));
        } else {
            axios.get(`http://localhost:1234/get-all-order-admin`)
                .then(res => {
                    if (res && res.data) {
                        setAllOrderAdmin(res.data);
                    }
                }).catch(err => console.log(err));
        }
    }
    return (
        <div className='all-admin'>
            <div className='container-fluid bg-white'>
                <div className='row'>
                    <div className='col-2 bg-white border'>
                        <SideBar />
                    </div>
                    <div className='col-10 p-0'>
                        <div className='all-order-management container-fluid p-0 bg-white'>
                            <div className='top d-flex p-2 w-100'>
                                <p className='fs-3 fw-bold me-5'>Order Management</p>
                            </div>
                            <div className='table-order'>
                                <table className='table'>
                                    <thead>
                                        <tr className='text-center'>
                                            <th onClick={() => handleSort('orderid')} style={sortOrderID === true ? { color: 'red' } : sortOrderID === false ? { color: 'blue' } : {}}>
                                                {
                                                    sortOrderID === true ? (<><i className="fa-solid fa-sort-up"></i>OrderID</>) : sortOrderID === false ? (<><i className="fa-solid fa-sort-down"></i>OrderID</>) : <>OrderID</>
                                                }
                                            </th>
                                            <th onClick={() => handleSort('username')} style={sortUsername === true ? { color: 'red', width: '8rem' } : sortUsername === false ? { color: 'blue', width: '8rem' } : { width: '8rem' }}>
                                                {
                                                    sortUsername === true ? (<><i class="fa-solid fa-sort-up"></i>Username</>) : sortUsername === false ? (<><i class="fa-solid fa-sort-down"></i>Username</>) : <>Username</>
                                                }
                                            </th>
                                            <th onClick={() => handleSort('date')} style={sortDate === true ? { color: 'red', width: '10rem' } : sortDate === false ? { color: 'blue', width: '10rem' } : { width: '10rem' }}>
                                                {
                                                    sortDate === true ? (<><i class="fa-solid fa-sort-up"></i>Date</>) : sortDate === false ? (<><i class="fa-solid fa-sort-down"></i>Date</>) : <>Date</>
                                                }
                                            </th>
                                            <th onClick={() => handleSort('total')} style={sortTotal === true ? { color: 'red' } : sortTotal === false ? { color: 'blue' } : {}}>
                                                {
                                                    sortTotal === true ? (<><i class="fa-solid fa-sort-up"></i>Total</>) : sortTotal === false ? (<><i class="fa-solid fa-sort-down"></i>Total</>) : <>Total</>
                                                }
                                            </th>
                                            <th onClick={() => handleSort('delivery')} style={sortDelivery === true ? { color: 'red' } : sortDelivery === false ? { color: 'blue' } : {}}>
                                                {
                                                    sortDelivery === true ? (<><i class="fa-solid fa-sort-up"></i>Delivery</>) : sortDelivery === false ? (<><i class="fa-solid fa-sort-down"></i>Delivery</>) : <>Delivery</>
                                                }
                                            </th>
                                            <th onClick={() => handleSort('payment')} style={sortPayment === true ? { color: 'red' } : sortPayment === false ? { color: 'blue' } : {}}>
                                                {
                                                    sortPayment === true ? (<><i class="fa-solid fa-sort-up"></i>Payment</>) : sortPayment === false ? (<><i class="fa-solid fa-sort-down"></i>Payment</>) : <>Payment</>
                                                }
                                            </th>
                                            <th onClick={() => handleSort('name')} style={sortName === true ? { color: 'red' } : sortName === false ? { color: 'blue' } : {}}>
                                                {
                                                    sortName === true ? (<><i class="fa-solid fa-sort-up"></i>Name</>) : sortName === false ? (<><i class="fa-solid fa-sort-down"></i>Name</>) : <>Name</>
                                                }
                                            </th>
                                            <th onClick={() => handleSort('address')} style={sortAddress === true ? { color: 'red' } : sortAddress === false ? { color: 'blue' } : {}}>
                                                {
                                                    sortAddress === true ? (<><i class="fa-solid fa-sort-up"></i>Address</>) : sortAddress === false ? (<><i class="fa-solid fa-sort-down"></i>Address</>) : <>Address</>
                                                }
                                            </th>
                                            <th onClick={() => handleSort('status')} style={sortStatus === true ? { color: 'red', width: '5rem' } : sortStatus === false ? { color: 'blue', width: '5rem' } : { width: '5rem' }}>
                                                {
                                                    sortStatus === true ? (<><i class="fa-solid fa-sort-up"></i>Status</>) : sortStatus === false ? (<><i class="fa-solid fa-sort-down"></i>Status</>) : <>Status</>
                                                }
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allOrderAdmin.map((order) => {
                                                if (order.status === 'finished') {
                                                    revenue += order.total;
                                                }
                                                if (order.status !== 'unfinished') {
                                                    orderCount++;
                                                }
                                                if (order.status === 'at the store') {
                                                    store++;
                                                }
                                                if (order.status === 'delivery') {
                                                    delivery++;
                                                }
                                                if (order.status === 'finished') {
                                                    finished++;
                                                }
                                                const dateTime = new Date(order.date);
                                                const formattedDateTime = dateTime.toLocaleString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                });
                                                return order.total !== 0 && order.status !== 'unfinished' && (
                                                    <tr key={order.orderid} className='text-center'>
                                                        <td onClick={() => handleClickSeeDetails(order.orderid)}>{order.orderid}</td>
                                                        <td onClick={() => handleClickSeeDetails(order.orderid)}>{order.username}</td>
                                                        <td onClick={() => handleClickSeeDetails(order.orderid)}>{formattedDateTime}</td>
                                                        <td onClick={() => handleClickSeeDetails(order.orderid)}>{order.total.toLocaleString()}đ</td>
                                                        <td onClick={() => handleClickSeeDetails(order.orderid)}>{order.delivery.charAt(0).toUpperCase() + order.delivery.slice(1)}</td>
                                                        <td onClick={() => handleClickSeeDetails(order.orderid)}>{order.payment}</td>
                                                        <td onClick={() => handleClickSeeDetails(order.orderid)}>{order.name.charAt(0).toUpperCase() + order.name.slice(1)}</td>
                                                        <td onClick={() => handleClickSeeDetails(order.orderid)}>{order.address.charAt(0).toUpperCase() + order.address.slice(1)}</td>
                                                        <td onClick={() => handleClickSeeDetails(order.orderid)}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</td>
                                                        {
                                                            order.status === 'delivery' || order.status === 'at the store' ?
                                                                (
                                                                    <td><button className='btn btn-success' onClick={((e) => handleUpdateOrder(order.orderid))}>Update</button></td>
                                                                ) : order.status === 'canceled' ?
                                                                    (
                                                                        <td><button className='btn btn-danger' onClick={(e) => handleDeleteOrder(order.orderid)}>Delete</button></td>
                                                                    ) :
                                                                    (
                                                                        <td className='finish' onClick={() => alert(`This order has been finished !!!`)}><p className='text-primary fw-bold'>Finished</p></td>
                                                                    )
                                                        }
                                                    </tr>
                                                )
                                            }
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='bottom p-2 my-2'>
                                <div className='info mx-2 d-flex'>
                                    <div>
                                        <p>Total order at the store: <b>{store}</b></p>
                                        <p>Total order delivery: <b>{delivery}</b></p>
                                        <p>Total order finished: <b>{finished}</b></p>
                                    </div>
                                    <div>
                                        <p>Total revenue: <b>{revenue.toLocaleString()}đ</b></p>
                                        <p>Total order: <b>{orderCount}</b></p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderManagement