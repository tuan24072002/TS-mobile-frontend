import React, { useCallback, useEffect, useState } from 'react';
import '../../styles/users/Cart.scss';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import ModalWarning from '../../components/users/ModalWarning';

const Cart = ({ updateQuantityOrderDetail }) => {
    axios.defaults.withCredentials = true;
    const [orderid, setOrderid] = useState('');
    const [username, setUsername] = useState('');
    const [cart, setCart] = useState([]);
    const [orderCount, setOrderCount] = useState(0);
    const [hoveredItems, setHoveredItems] = useState([]);
    const [showModalWarning, setShowModalWarning] = useState(false);
    const navigate = useNavigate();
    let totalPrice = 0;
    const handleClose = () => {
        setShowModalWarning(false);
    }
    const handleIconHover = (index) => {
        const updatedHoveredItems = [...hoveredItems];
        updatedHoveredItems[index] = true;
        setHoveredItems(updatedHoveredItems);
    };

    const handleIconLeave = (index) => {
        const updatedHoveredItems = [...hoveredItems];
        updatedHoveredItems[index] = false;
        setHoveredItems(updatedHoveredItems);
    };
    // useEffect(() => {
    //     const setTotalPrice = () => {
    //         if (cart.length === 0) {
    //             totalPrice = 0;
    //         }
    //     };
    //     setTotalPrice(); // Gọi hàm setTotalPrice ở đây
    // });

    const updateTotal = useCallback(async () => {
        try {
            if (orderid && cart.length > 0) {
                const res = await axios.post(`http://localhost:1234/update-total/${orderid}`, { totalPrice });
                if (res && res.data && res.data.updateTotal === true) {

                }
            } else if (orderid && cart.length === 0) {
                const res = await axios.get(`http://localhost:1234/delete-total/${orderid}`);
                if (res && res.data && res.data.deletetotal === true) {

                }
            }
        } catch (error) {
            console.log(error);
        }
    }, [orderid, cart, totalPrice]);
    useEffect(() => {
        updateTotal();
    }, [updateTotal])
    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:1234/orderdetail-quantity/' + orderid);
            if (response && response.data.length > 0) {
                setOrderCount(response.data[0].ordercount);
            }
        } catch (error) {
            console.error('Error fetching order quantity:', error);
        }
    }, [orderid]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const handleIncrease = async (productid) => {
        await axios.get(`http://localhost:1234/increase-quantity/${orderid}/${productid}`)
            .then(increaseQuantity => {
                if (increaseQuantity && increaseQuantity.data.result === true && increaseQuantity.data.message === 'Quantity increased successfully') {
                    toast.success('Increase quantity successfully!!!');
                } else if (increaseQuantity && increaseQuantity.data.result === true && increaseQuantity.data.message === 'Quantity has reached the limit') {
                    setShowModalWarning(true);
                }
                else {
                    toast.error('Failed to increase quantity!!!');
                }
            }).catch(errIncreaseQuantity => console.log(errIncreaseQuantity));
        getAllOrderDetail();
    };
    const handleDeleteCart = async (productid) => {
        await axios.delete(`http://localhost:1234/delete-cart/${orderid}/${productid}`)
            .then(res => {
                if (res && res.data.delete === true) {
                    toast.success('Product removed from cart successfully !!!');
                } else {
                    toast.error('Failed to remove product from cart !!!');
                }
            }).catch(err => console.log(err));
        fetchData();
        getAllOrderDetail();
        updateQuantityOrderDetail();
    }
    const handleDecrease = async (productid) => {
        await axios.get(`http://localhost:1234/decrease-quantity/${orderid}/${productid}`)
            .then(decreaseQuantity => {
                if (decreaseQuantity && decreaseQuantity.data.result === true && decreaseQuantity.data.message === 'Quantity decrease successfully') {
                    toast.success('Decrease quantity successfully!!!');
                } else if (decreaseQuantity && decreaseQuantity.data.result === true && decreaseQuantity.data.message === 'Reduced quantity has reached the limit') {
                    handleDeleteCart(productid);
                }
                else {
                    toast.error('Failed to decrease quantity!!!');
                }
            }).catch(errDecreaseQuantity => console.log(errDecreaseQuantity));
        getAllOrderDetail();
        updateQuantityOrderDetail();
    };

    const getOrderID = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:1234/check-order-exist/${username}`);
            if (res.data && res.data.length > 0) {
                setOrderid(res.data[0].orderid);
            } else {
                setOrderid('');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }, [username]);
    useEffect(() => {
        getOrderID();
    }, [getOrderID]);
    const getAllOrderDetail = async () => {
        try {
            const res = await axios.get(`http://localhost:1234/get-all-orderdetail/${orderid}`);
            setCart(res.data);
        } catch (error) {
            console.error("Error fetching order detail:", error);
        }
    };
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


    useEffect(() => {
        axios.get('http://localhost:1234/')
            .then(res => {
                if (res.data.success === true) {
                    setUsername(res.data.username);
                } else {
                    setUsername('');
                }
            }).catch(err => console.log(err));
    }, [username]);

    const setEmptyOrderCount = () => {
        if (orderCount < 1)
            setOrderCount(0);
    }
    useEffect(() => {
        setEmptyOrderCount();
    });
    return (
        <>
            {
                orderCount !== 0 ? (
                    <div className='all-cart py-4'>
                        <div className='cart'>
                            <div className='title'>
                                <a href='/product'><h3 className='back'>Back</h3></a>
                                <h3 className='giohang'>Cart</h3>
                            </div>
                            <hr />
                            <div className='cart-center'>
                                {
                                    cart.map((data) => {
                                        const subTotal = data.quantity * data.price;
                                        totalPrice += data.quantity * data.price;
                                        return (
                                            <div className='card-cart' key={data.productid}>
                                                <div className='card-image'>
                                                    <img src={`http://localhost:1234/images/${data.image}`} alt='' />
                                                </div>
                                                <div className='card-info'>
                                                    <div className='card-name'><Link style={{ textDecoration: 'none', color: '#666' }} to={`/product/${data.productid}/${data.typeid}/${data.categoryid}/${data.colorid}/${data.memoryid}`}><b>{data.name}</b></Link></div>
                                                    <div className='card-price'>
                                                        <div className='price text-danger'><b>{data.price.toLocaleString()}đ</b></div>
                                                        <div className='cost'><p>{data.cost.toLocaleString()}đ</p></div>
                                                    </div>
                                                </div>
                                                <div className='card-action'>
                                                    <div className='trash' onClick={() => handleDeleteCart(`${data.productid}`)}>
                                                        <i
                                                            className={classNames('fa-solid', 'fa-trash', { 'fa-shake': hoveredItems[data.productid] })}
                                                            onMouseEnter={() => handleIconHover(data.productid)}
                                                            onMouseLeave={() => handleIconLeave(data.productid)}
                                                        ></i>
                                                    </div>
                                                    <div className='quantity'>
                                                        <button onClick={() => handleDecrease(`${data.productid}`)}>-</button>
                                                        <input type="number" min={'0'} className='form-control' value={data.quantity} readOnly />
                                                        <button onClick={() => handleIncrease(`${data.productid}`)}>+</button>
                                                    </div>
                                                </div>
                                                <div className='subtotal'><b>Subtotal: {subTotal.toLocaleString()}đ</b></div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='payment'>
                                <div className='total'>
                                    <div className='title'><b>Total:</b></div>
                                    <div className='total'><b>{totalPrice.toLocaleString()}đ</b></div>
                                </div>
                                <div className='button-payment'><button onClick={() => navigate(`/order-information`)}>Order Now</button></div>
                                <Link to={'/product'} style={{ textDecoration: 'none', color: '#222' }}><div className='button-buy'><button>Continue To Buy Product</button></div></Link>
                            </div>
                        </div >
                    </div >
                ) : (
                    <div className='all-cart py-4'>
                        <div className='cart'>
                            <div className='title'>
                                <a href='/product'><h3 className='back'>Back</h3></a>
                                <h3 className='giohang'>Cart</h3>
                            </div>
                            <hr />
                            <div className='cart-content'>
                                <div className='cart-empty'>
                                    <div className='icon-sad my-5'><i class="fa-solid fa-face-frown fa-beat"></i></div>
                                    <p>There are no products in the cart, please return</p>
                                    <a href='/' className='btn btn-danger my-5'>Go back to the Home Page</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <ModalWarning show={showModalWarning} handleClose={handleClose} />
        </>
    )
}

export default Cart