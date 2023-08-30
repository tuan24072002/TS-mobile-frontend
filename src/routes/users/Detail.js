import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../../styles/users/Detail.scss';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { toast } from 'react-toastify';
import ModalWarning from '../../components/users/ModalWarning';

const Detail = ({ updateQuantityOrderDetail, scrollToTop }) => {
    const Responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1200 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1200, min: 1000 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 1000, min: 0 },
            items: 2
        },
        mini_mobile: {
            breakpoint: { max: 700, min: 0 },
            items: 1
        }
    };
    axios.defaults.withCredentials = true;
    const [storeCount, setStoreCount] = useState(0);
    const [product, setProduct] = useState([]);
    const [memoryAndPrice, setMemoryAndPrice] = useState([]);
    const [imageColorPrice, setImageColorPrice] = useState([]);
    const [store, setStore] = useState([]);
    const [selectedMemory, setSelectedMemory] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const { id, typeid, categoryid, colorid, memoryid } = useParams();
    const [productByID, setProductByID] = useState([]);
    const [username, setUsername] = useState('');
    const [orderid, setOrderid] = useState('');
    const [price, setPrice] = useState('');
    const [productid, setProductid] = useState('');
    const navigate = useNavigate();
    const [showModalWarning, setShowModalWarning] = useState(false);
    const handleClose = () => {
        setShowModalWarning(false);
    }
    const handleColorClick = async (colorname, productid, color_id) => {
        setSelectedColor(colorname);
        try {
            const res = await axios.get(`http://localhost:1234/phonebyid/${productid}/${typeid}/${categoryid}/${color_id}/${memoryid}`);
            setProductByID(res.data);
            navigate(`/product/${productid}/${typeid}/${categoryid}/${color_id}/${memoryid}`);
        } catch (error) {
            console.log(error);
        }
    };
    const handleMemoryClick = async (memoryname, memory_id, productid) => {
        setSelectedMemory(memoryname);
        try {
            const res = await axios.get(`http://localhost:1234/phonebyid/${productid}/${typeid}/${categoryid}/${colorid}/${memory_id}`);
            setProductByID(res.data);
            navigate(`/product/${productid}/${typeid}/${categoryid}/${colorid}/${memory_id}`);
        } catch (error) {
            console.log(error);
        }
    };
    const getStore = useCallback(async () => {
        await axios.get(`http://localhost:1234/store/${productid}`)
            .then(res => {
                if (res && res.data.length > 0) {
                    setStore(res.data);
                } else {
                    setStore([]);
                }
            }).catch(err => console.log(err));
    }, [productid]);
    useEffect(() => {
        getStore();
    }, [getStore]);
    const storequantity = useCallback(async () => {
        await axios.get(`http://localhost:1234/store-quantity/${productid}`)
            .then(res => {
                if (res && res.data.length > 0) {
                    setStoreCount(res.data[0].storecount);
                } else {
                    setStoreCount(0);
                }
            }).catch(err => console.log(err));
    }, [productid]);
    useEffect(() => {
        storequantity();
    }, [storequantity]);
    useEffect(() => {
        const memory_name = async () => {
            const res = await axios.get(`http://localhost:1234/phone-memoryname/${id}`);
            setSelectedMemory(res.data[0].memoryname);
        };
        memory_name();
    }, [id]);
    useEffect(() => {
        const color_name = async () => {
            const res = await axios.get(`http://localhost:1234/phone-colorname/${id}`);
            setSelectedColor(res.data[0].colorname);
        }
        color_name();
    }, [id]);
    useEffect(() => {
        const normal = async () => {
            try {
                const res = await axios.get(`http://localhost:1234/phone/`);
                setProduct(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        normal();
    }, []);
    useEffect(() => {
        const fetchProductByID = async () => {
            const res = await axios.get(`http://localhost:1234/phonebyid/${id}/${typeid}/${categoryid}/${colorid}/${memoryid}`);
            setProductByID(res.data);
            setPrice(res.data[0].price);
            setProductid(res.data[0].id);
        }
        fetchProductByID();
    }, [id, typeid, categoryid, colorid, memoryid]);
    useEffect(() => {
        const memory_price = async () => {
            const res = await axios.get(`http://localhost:1234/phone-memory-price/${typeid}/${categoryid}/${colorid}`);
            setMemoryAndPrice(res.data);
        }
        memory_price();
    }, [typeid, categoryid, colorid]);
    useEffect(() => {
        const image_color_price = async () => {
            const res = await axios.get(`http://localhost:1234/phone-image-color-price/${typeid}/${categoryid}/${memoryid}`);
            setImageColorPrice(res.data);
        }
        image_color_price();
    }, [typeid, categoryid, memoryid]);
    useEffect(() => {
        axios.get('http://localhost:1234/')
            .then(res => {
                if (res.data.success === true) {
                    setUsername(res.data.username);
                } else {
                    setUsername('');
                }
            })
    }, []);
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
    const handleBuyNow = async () => {
        if (username === '') {
            toast.error('You must be logged in to add products to your cart !!!');
        } else {
            try {
                getOrderID();
                axios.get(`http://localhost:1234/check-product-exist/${orderid}/${productid}`)
                    .then(checkProductExist => {
                        if (checkProductExist && checkProductExist.data.length > 0) {
                            axios.get(`http://localhost:1234/increase-quantity/${orderid}/${productid}`)
                                .then(increaseQuantity => {
                                    if (increaseQuantity && increaseQuantity.data.result === true) {
                                        navigate('/cart');
                                        updateQuantityOrderDetail();
                                    } else {
                                        toast.error('Failed to increase quantity!!!');
                                    }
                                }).catch(errIncreaseQuantity => console.log(errIncreaseQuantity));
                        } else {
                            axios.post('http://localhost:1234/add-order-detail', { orderid, productid, price })
                                .then(addOrderDetail => {
                                    if (addOrderDetail && addOrderDetail.data.result === true) {
                                        navigate('/cart');
                                        updateQuantityOrderDetail();
                                    } else {
                                        toast.error('Failed to add to cart!!!');
                                    }
                                }).catch(errAddOrderDetail => console.log(errAddOrderDetail));
                        }
                    }).catch(errCheckProductExist => console.log(errCheckProductExist));
            } catch (error) {
                console.log(error);
            }
        }
    }
    const handleAddtoCart = async () => {
        if (username === '') {
            toast.error('You must be logged in to add products to your cart !!!');
        } else {
            try {
                getOrderID();
                axios.get(`http://localhost:1234/check-product-exist/${orderid}/${productid}`)
                    .then(checkProductExist => {
                        if (checkProductExist && checkProductExist.data.length > 0) {
                            axios.get(`http://localhost:1234/increase-quantity/${orderid}/${productid}`)
                                .then(increaseQuantity => {
                                    if (increaseQuantity && increaseQuantity.data.result === true && increaseQuantity.data.message === 'Quantity increased successfully') {
                                        toast.success('Increase quantity successfully!!!');
                                        updateQuantityOrderDetail();
                                    } else if (increaseQuantity && increaseQuantity.data.result === true && increaseQuantity.data.message === 'Quantity has reached the limit') {
                                        // toast.warning('Quantity has reached the limit, if you want to buy more, please contact 0587928264');
                                        setShowModalWarning(true);
                                    }
                                    else {
                                        toast.error('Failed to increase quantity!!!');
                                    }
                                }).catch(errIncreaseQuantity => console.log(errIncreaseQuantity));
                        } else {
                            axios.post('http://localhost:1234/add-order-detail', { orderid, productid, price })
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

        }
    };
    const handleSoldOut = () => {
        toast.warn(`Phonenumber: 058 792 8264 - Email: 0995086534ts@gmail.com`);
    }

    return (
        <>
            <div className='detail-container'>
                {
                    productByID.map((data) => (
                        <div className='all-detail'>
                            <div className='detail-name pt-4'><h3>{data.name}</h3></div>
                            <hr />
                            <div className='detail-content'>
                                <div className='detail-left'>
                                    <div className='image'>
                                        <img src={`http://localhost:1234/images/${data.image}`} alt='' />
                                        <div className='love'>
                                            <i className='fa-solid fa-heart'></i>
                                        </div>
                                        {
                                            data.quantity > 0 ? <></>
                                                : <div className='sold-out'>
                                                    <img src={`http://localhost:1234/icon/sold.png`} alt='' />
                                                </div>
                                        }
                                    </div>
                                    <div className='information'>
                                        <div className='product-information my-2'>
                                            <h5>Product information</h5>
                                            <p>
                                                <i class="fa-solid fa-mobile mx-2"></i>100% new machine, genuine Apple Vietnam. CellphoneS is currently an authorized reseller of genuine iPhone VN/A of Apple Vietnam<br />
                                                <i class="fa-solid fa-box-open mx-2"></i>Box, Manual, Sim Tree, Lightning Cable - Type C <br />
                                                <i class="fa-solid fa-shield mx-2"></i>1 EXCHANGE 1 in 30 days if there is a manufacturer hardware defect. 12 months warranty at genuine Apple service center : Fun Phone ASP (Apple Authorized Service Provider)<br />
                                            </p>
                                        </div>
                                        <div className='store my-2'>
                                            <p>There are <b>{storeCount}</b> stores with products</p>
                                            <table class="table table-striped table-hover">
                                                <tbody>
                                                    {
                                                        store.map((storedata) => (
                                                            <tr><td>{storedata.storename}</td></tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className='detail-right'>
                                    <h4>Memory</h4>
                                    <div className='memory my-3'>
                                        {
                                            memoryAndPrice.map((mp) => (
                                                <div className={`memory-item ${selectedMemory === mp.memoryname ? 'active' : ''}`}
                                                    key={mp.memoryname}
                                                    onClick={() => handleMemoryClick(mp.memoryname, mp.memoryid, mp.id)}>
                                                    <p><b>{mp.memoryname}</b><br />{mp.price.toLocaleString()}đ</p>
                                                    <i class="fa-solid fa-circle-check"></i>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <h4>Color</h4>
                                    <div className='color my-3'>
                                        {
                                            imageColorPrice.map((icp) => (
                                                <div className={`color-item ${selectedColor === icp.colorname ? 'active' : ''}`}
                                                    key={icp.colorname}
                                                    onClick={() => handleColorClick(icp.colorname, icp.id, icp.colorid)}>
                                                    <img src={`http://localhost:1234/images/${icp.image}`} alt='' />
                                                    <p><b>{icp.colorname}</b><br />{icp.price.toLocaleString()}đ</p>
                                                    <i class="fa-solid fa-circle-check"></i>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className='promotion'>
                                        <div className='title'>
                                            <h6><i class="fa-solid fa-gift mx-3"></i>Promotion</h6>
                                        </div>
                                        <div className='content'>
                                            <div className='content-item my-4 mx-2'><b>1</b><p className='mx-2'>10% off when paying by credit card</p></div>
                                            <div className='content-item mx-2'><b>2</b><p className='mx-2'>Extra 5% off when you have a membership card</p></div>
                                        </div>
                                    </div>
                                    <div className='payment'>
                                        {
                                            data.quantity > 0 ?
                                                <>
                                                    <button className='buy-now my-2' onClick={handleBuyNow}><b>Buy Now</b><p>(Fast delivery in 2 hours or pick up in store)</p></button>
                                                    <button className='add-to-cart my-2 mx-2' onClick={handleAddtoCart}><i class="fa-solid fa-cart-plus"></i><p>Add to cart</p></button>
                                                </> :
                                                <button className='btn-sold-out col-12 my-2' onClick={handleSoldOut}><b>Coming soon</b><p>(Please contact us directly)</p></button>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='specifications my-2'>
                                <h3>
                                    Specifications
                                </h3>
                                <table className='table table-striped'>
                                    <tbody>
                                        <tr>
                                            <th>Screen size:</th>
                                            <td>{data.inch}</td>
                                        </tr>
                                        <tr>
                                            <th>Screen resolution:</th>
                                            <td>{data.screenResolution}</td>
                                        </tr>
                                        <tr>
                                            <th>Operating system:</th>
                                            <td>{data.operatingSystem}</td>
                                        </tr>
                                        <tr>
                                            <th>Screen technology</th>
                                            <td>{data.screenTechnology}</td>
                                        </tr>
                                        <tr>
                                            <th>Rear camera</th>
                                            <td>{data.rearCamera}</td>
                                        </tr>
                                        <tr>
                                            <th>Front camera</th>
                                            <td>{data.frontCamera}</td>
                                        </tr>
                                        <tr>
                                            <th>Ram</th>
                                            <td>{data.ramname}</td>
                                        </tr>
                                        <tr>
                                            <th>Memory</th>
                                            <td>{data.memoryname}</td>
                                        </tr>
                                        <tr>
                                            <th>Sim</th>
                                            <td>{data.sim}</td>
                                        </tr>
                                        <tr>
                                            <th>Screen feature</th>
                                            <td>{data.screenFeature}</td>
                                        </tr>
                                        <tr>
                                            <th>Pin</th>
                                            <td>{data.pin}</td>
                                        </tr>
                                        <tr>
                                            <th>Chipset</th>
                                            <td>{data.chipset}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='similar-product'>
                                <Carousel responsive={Responsive}>
                                    {
                                        product.map((value) => (

                                            <div className='card-product' onClick={scrollToTop}>
                                                <Link style={{ textDecoration: "none", color: "#222" }} to={`/product/` + value.id + `/` + value.typeid + '/' + value.categoryid + '/' + value.colorid + '/' + value.memoryid}>
                                                    <div className='card-image'>
                                                        <img src={`http://localhost:1234/images/${value.image}`} alt='' />
                                                    </div>
                                                    <div className='card-name'>
                                                        <b>{value.name}</b>
                                                    </div>
                                                    <div className='card-feature'>
                                                        <div className='item'>{value.inch}</div>
                                                        <div className='item'>{value.ramname}</div>
                                                        <div className='item'>{value.memoryname}</div>
                                                    </div>
                                                    <div className='price-cost'>
                                                        <div className='price'>{value.price.toLocaleString()}đ</div>
                                                        <div className='cost'>{value.cost.toLocaleString()}đ</div>
                                                    </div>
                                                    <div className='love'>
                                                        <i className='fa-solid fa-heart'></i>
                                                    </div>
                                                </Link>
                                            </div>

                                        ))
                                    }
                                </Carousel>
                            </div>

                        </div>
                    ))
                }

            </div>
            <ModalWarning show={showModalWarning} handleClose={handleClose} />
        </>
    )
}

export default Detail