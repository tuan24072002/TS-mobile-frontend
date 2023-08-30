import React, { useCallback, useEffect, useState } from 'react'
import '../../styles/users/OrderInformation.scss';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OrderInformation = ({ getOrderID, orderid }) => {
    const [selectedRadio, setSelectedRadio] = useState('Pick up at the store');
    const [selectedOption, setSelectedOption] = useState('');
    const [store, setStore] = useState([]);
    const [city, setCity] = useState([]);
    const [provinceid, setProvinceid] = useState(0);
    const [district, setDistrict] = useState([]);
    const [districtid, setDistrictid] = useState(0);
    const [ward, setWard] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [housenumber, setHousenumber] = useState('');
    const [wardname, setWardname] = useState('');
    const [districtname, setDistrictname] = useState('');
    const [cityname, setCityname] = useState('');
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState([]);
    axios.defaults.withCredentials = true;
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
    const handleInputChange = (event) => {
        setUserInfo(prev => ({ ...prev, [event.target.name]: event.target.value }))
    };
    const handleHousenumberChange = (event) => {
        setHousenumber(event.target.value);
    };
    const handleOptionChange = useCallback((event) => {
        setSelectedOption(event.target.value);
    }, []);
    const handleCityChange = (event) => {
        const name_city = event.target.value;
        setProvinceid(name_city.split('-')[0]);
        setCityname(name_city.split('-')[1]);
    }
    const handleDistrictChange = (event) => {
        const name_district = event.target.value;
        setDistrictid(name_district.split('-')[0]);
        setDistrictname(name_district.split('-')[1]);
    }
    const handleWardChange = (event) => {
        setWardname(event.target.value);
    }
    const handleRadioChange = (event) => {
        setSelectedRadio(event.target.value);
    };
    const getTotalPrice = useCallback(async () => {
        axios.get(`http://localhost:1234/get-total/${orderid}`)
            .then(res => {
                if (res && res.data) {
                    setTotalPrice(res.data[0].total);
                } else {
                    console.log('Failed');
                }
            }).catch(err => console.log(err));
    }, [orderid]);
    useEffect(() => {
        getTotalPrice();
    }, [getTotalPrice]);
    const fetchDataCity = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:1234/api/province/');
            const formatCity = res.data.results.map(city => ({
                id: city.province_id,
                name: city.province_name
            }));
            setCity(formatCity);
        } catch (error) {
            console.error(error);
        }
    }, []);
    const fetchDataDistrict = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:1234/api/province/district/${provinceid}`);
            const formatDistrict = res.data.results.map(district => ({
                id: district.district_id,
                name: district.district_name
            }));
            setDistrict(formatDistrict);
        } catch (error) {
            console.log(error);
        }
    }, [provinceid]);
    const fetchDataWard = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:1234/api/province/ward/${districtid}`);
            const formatWard = res.data.results.map(ward => ({
                id: ward.ward_id,
                name: ward.ward_name
            }));
            setWard(formatWard);
        } catch (error) {
            console.log(error);
        }
    }, [districtid]);
    useEffect(() => {
        fetchDataCity();
        fetchDataDistrict();
        fetchDataWard();
    }, [fetchDataCity, fetchDataDistrict, fetchDataWard]);
    useEffect(() => {
        const getStore = async () => {
            await axios.get('http://localhost:1234/store-name')
                .then(res => {
                    if (res)
                        setStore(res.data);
                });
        };
        getStore();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (userInfo.name === '' || userInfo.phonenumber === '' || userInfo.email === '') {
            toast.error('Please complete the order information!');
        } else {
            if (selectedRadio === 'Pick up at the store' && selectedOption !== '') {
                const requestBody = {
                    delivery: selectedRadio,
                    payment: 'at the store',
                    name: userInfo.name,
                    phonenumber: userInfo.phonenumber,
                    email: userInfo.email,
                    address: selectedOption,
                    status: 'at the store'
                };
                await axios.post(`http://localhost:1234/order-confirm/${orderid}`, requestBody)
                    .then(res => {
                        if (res && res.data.order === true) {
                            navigate('/coupon', { state: { orderid } });
                            getOrderID();
                        }
                        else if (res && res.data.order === false) {
                            toast.error('Your order is failed !!!');
                        } else {
                            toast.error('Something wrong !!!');
                        }
                    }).catch(err => console.log(err));
            } else if (selectedRadio === 'Deliver to your home') {
                if (housenumber === '' || wardname === '' || districtname === '' || cityname === '') {
                    toast.error('Please complete the address to complete the order !!!');
                } else {
                    const address = `${housenumber}, ${wardname}, ${districtname}, ${cityname}`;
                    const requestBody = {
                        delivery: selectedRadio,
                        payment: '',
                        name: userInfo.name,
                        phonenumber: userInfo.phonenumber,
                        email: userInfo.email,
                        address: address,
                        status: 'unfinished'
                    };
                    await axios.post(`http://localhost:1234/order-confirm/${orderid}`, requestBody)
                        .then(res => {
                            if (res && res.data.order === true) {
                                navigate('/coupon', { state: { orderid } });
                                getOrderID();
                            }
                            else if (res && res.data.order === false) {
                                toast.error('Your order is failed !!!');
                            } else {
                                toast.error('Something wrong !!!');
                            }
                        }).catch(err => console.log(err));
                }
            } else {
                toast.error('Please select a store to receive the product');
            }
        }
    }
    return (
        <div className='all-order py-4'>
            <div className='order'>
                <div className='title'>
                    <a href='/cart'><h3 className='back'>Back</h3></a>
                    <h3 className='giohang'>Order Information</h3>
                </div>
                <hr />
                <div className='order-content'>
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
                            <span className="icon-separator fw-bold fs-5">-----</span>
                            <div className='icon'>
                                <i class="fa-solid fa-ticket" style={{ border: '2px solid #222' }}></i>
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
                        <div className='center'>
                            <div className='title w-100 my-2'><b>Customer information</b></div>
                            <form className='form w-100 d-flex flex-column' onSubmit={handleSubmit}>
                                <input type='text' value={userInfo.name} name='name' id='name' placeholder='Enter your Name (*)' className='form-control my-2' onChange={handleInputChange} />
                                <input type='number' value={userInfo.phonenumber} name='phonenumber' id='phonenumber' placeholder='Enter your Phonenumber (*)' onChange={handleInputChange} className='form-control my-2' />
                                <input type='mail' value={userInfo.email} name='email' id='email' placeholder='Enter your Email (*)' className='form-control my-2' onChange={handleInputChange} />
                                <div className='delivery-method'>
                                    <b className='my-2'>Choose a delivery method</b>
                                    <div className='select my-2'>
                                        <label style={{ marginRight: '1rem' }}>
                                            <input
                                                name='delivery'
                                                type="radio"
                                                value="Pick up at the store"
                                                checked={selectedRadio === "Pick up at the store"}
                                                onChange={handleRadioChange}
                                                className='form-radio-control'
                                            />
                                            Pick up at the store
                                        </label>
                                        <label>
                                            <input
                                                name='delivery'
                                                type="radio"
                                                value="Deliver to your home"
                                                checked={selectedRadio === "Deliver to your home"}
                                                onChange={handleRadioChange}
                                                className='form-radio-control'
                                            />
                                            Deliver to your home
                                        </label>
                                    </div>
                                </div>
                                {
                                    selectedRadio === 'Pick up at the store' ? (
                                        <select value={selectedOption} onChange={handleOptionChange} className='form-control my-2'>
                                            <option value="">Choose a store address ...</option>
                                            {
                                                store.map((store) => (
                                                    <option value={`store ${store.storeid}: ${store.storename}`}>{store.storename}</option>
                                                ))
                                            }
                                        </select>
                                    ) : (
                                        <>
                                            <div className='row my-2'>
                                                <div className='col-6'>

                                                    <select className='form-control' onChange={handleCityChange}>
                                                        <option value=''>-- Select City --</option>
                                                        {
                                                            city.map((select_city) => (
                                                                <option key={select_city.id} value={`${select_city.id}-${select_city.name}`}>{select_city.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    {/* <select className='form-control'>
                                                    <option value=''>-- Select City --</option>
                                                </select> */}
                                                </div>
                                                <div className='col-6'>
                                                    <select className='form-control' onChange={handleDistrictChange}>
                                                        <option value=''>-- Select District --</option>
                                                        {district.length === 0 ?
                                                            <></>
                                                            : (
                                                                district.map((select_district) => (
                                                                    <>
                                                                        <option value={`${select_district.id}-${select_district.name}`}>{select_district.name}</option>
                                                                    </>
                                                                ))

                                                            )
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='row  my-2'>
                                                <div className='col-6'>
                                                    <select className='form-control' onChange={handleWardChange}>
                                                        <option value=''>-- Select Ward --</option>
                                                        {ward.length > 0 ?
                                                            ward.map((select_ward) => (
                                                                <>
                                                                    <option value={select_ward.name}>{select_ward.name}</option>
                                                                </>
                                                            ))
                                                            : <></>
                                                        }
                                                    </select>
                                                </div>
                                                <div className='col-6'>
                                                    <input type="text" placeholder='House number, street name' name='housenumber' onChange={(e) => handleHousenumberChange(e)} className='form-control' />
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                                {
                                    totalPrice !== 0 ? (
                                        <div className='payment'>
                                            <div className='total'>
                                                <div className='title'><b>Total:</b></div>
                                                <div className='total'><b>{totalPrice.toLocaleString()}đ</b></div>
                                            </div>
                                            <div className='button-payment'><button type="submit">Continue</button></div>
                                            <Link to={'/product'} style={{ textDecoration: 'none', color: '#222' }}><div className='button-buy'><button>Choose more products</button></div></Link>
                                        </div>
                                    ) : <></>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderInformation