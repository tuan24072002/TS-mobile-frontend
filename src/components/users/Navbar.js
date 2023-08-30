import React, { useEffect, useState } from 'react';
import './Navbar.scss';
import { MenuItems } from './MenuItems.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo/logo.png';
import Dropdown from 'react-bootstrap/Dropdown';
import OutsideClickHandler from 'react-outside-click-handler';

const Navbar = ({ name, avatar, role }) => {
    const [clicked, setClicked] = useState(false);
    const [user, setUser] = useState(false);
    const [username, setUsername] = useState('');
    const [search, setSearch] = useState('');
    const [filterSearch, setFilterSearch] = useState([]);
    const [randomProduct, setRandomProduct] = useState([]);
    const [showRandomProducts, setShowRandomProducts] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const handleClick = () => {
        setClicked(!clicked);
    };

    useEffect(() => {
        axios.get('http://localhost:1234/')
            .then(res => {
                if (res.data.success === true) {
                    setUser(true);
                    setUsername(res.data.username);
                } else {
                    setUser(false);
                }
            })
    }, [username]);



    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:1234/logout')
                .then(res => {
                    window.location.replace('/');
                }).catch(err => console.log(err));
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        const getAllProduct = async () => {
            try {
                const response = await axios.get('http://localhost:1234/phone-sort/DESC');
                setFilterSearch(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        getAllProduct();
    }, []);
    const handleFilterSearch = (value) => {
        setSearch(value);
    };
    const filteredProducts = filterSearch.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 6);
    const handleClickSearch = () => {
        if (search === '') {
            setShowRandomProducts(true);
            const randomIndex = getRandomIndexes(4, filterSearch.length);
            const selectedProducts = randomIndex.map((index) => filterSearch[index]);
            setRandomProduct(selectedProducts);
        } else {
            setShowRandomProducts(false);
            setRandomProduct([]);
        }
    }
    const getRandomIndexes = (count, maxIndex) => {
        const indexes = [];
        while (indexes.length < count) {
            const randomIndex = Math.floor(Math.random() * maxIndex);
            if (!indexes.includes(randomIndex)) {
                indexes.push(randomIndex);
            }
        }
        return indexes;
    };
    const handleKeyDownSearch = () => {
        setRandomProduct([]);
    };
    const closeSearch = () => {
        setSearch('');
        setShowRandomProducts(false);
    }
    const handleSearch = (search) => {
        navigate('/search', { state: { search } });
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch(search);
            setSearch('');
            setShowRandomProducts(false);
        }
    };
    return (
        <nav className='NavbarItems'>
            <h1 className='navbar-logo'>
                <a href='/'><img src={logo} alt='' /></a>
            </h1>
            <div className='menu-icons' onClick={handleClick}>
                <i className={clicked ? 'fa-solid fa-times fa-beat' : 'fa-solid fa-bars fa-beat'}></i>
            </div>
            <OutsideClickHandler onOutsideClick={() => closeSearch()} >
                <div className='all-search d-flex flex-column'>
                    <div className='search-form w-100 d-flex'>
                        <input type='text' placeholder='Search...' value={search} onChange={(e) => handleFilterSearch(e.target.value)} onClick={handleClickSearch} onKeyDown={handleKeyDownSearch} onKeyPress={handleKeyPress} />
                        <button type='submit' onClick={() => handleSearch(search)}><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    {
                        search !== '' ?
                            <div className='search-result'>
                                {
                                    filteredProducts.length !== 0 ? filteredProducts.map((product, index) => (
                                        <Link style={{ textDecoration: "none", color: "#222" }} to={`/product/` + product.id + `/` + product.typeid + '/' + product.categoryid + '/' + product.colorid + '/' + product.memoryid} onClick={() => { setSearch(''); setShowRandomProducts(false) }}>
                                            <div key={index} className='search-item d-flex'>
                                                <div className='image'>
                                                    <img src={`http://localhost:1234/images/${product.image}`} alt='' />
                                                </div>
                                                <div className='name'>
                                                    {product.name}
                                                </div>
                                            </div>
                                        </Link>
                                    )) : <div className='search-empty'>
                                        <p className='fs-5 text-center'>No search results !!!</p>
                                    </div>
                                }
                            </div>
                            : showRandomProducts ? (
                                <div className='search-result'>
                                    {
                                        randomProduct.length !== 0 ? randomProduct.map((product, index) => (
                                            <Link style={{ textDecoration: "none", color: "#222" }} to={`/product/` + product.id + `/` + product.typeid + '/' + product.categoryid + '/' + product.colorid + '/' + product.memoryid} onClick={() => { setSearch(''); setShowRandomProducts(false) }}>
                                                <div key={index} className='search-item d-flex'>
                                                    <div className='image'>
                                                        <img src={`http://localhost:1234/images/${product.image}`} alt='' />
                                                    </div>
                                                    <div className='name'>
                                                        {product.name}
                                                    </div>
                                                </div>
                                            </Link>
                                        )) : <div className='search-empty'>
                                            <p className='fs-5 text-center'>No search results !!!</p>
                                        </div>
                                    }
                                </div>
                            ) : search === '' && showRandomProducts === false ? <></> : <></>
                    }
                </div>
            </OutsideClickHandler>
            <ul className={clicked ? 'nav-menu active' : 'nav-menu'}>
                {MenuItems.map((item, index) => (
                    <li key={index}>
                        <Link className={item.cName} to={item.url}>
                            <i className={item.icon}></i>
                            {item.title}
                        </Link>
                    </li>
                ))}
                {
                    user ? (
                        <>
                            <Dropdown className='d-flex dropdown nav-links'>
                                <Dropdown.Toggle variant="default" id="dropdown-menu">
                                    <span className='nav-links-user'>
                                        <img src={`http://localhost:1234/avatar/${avatar}`} className='beat-effect' alt='' />
                                        {name}
                                    </span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="/info-customer" className='text-primary'><i class="fa-solid fa-user fa-beat"></i> Profile</Dropdown.Item>
                                    <Dropdown.Item href="/change-password" className='text-dark'><i class="fa-solid fa-gear fa-beat"></i> Change Password</Dropdown.Item>
                                    <Dropdown.Item href="/order-management" className='text-success'><i class="fa-solid fa-cart-plus fa-beat"></i> Order History</Dropdown.Item>
                                    {
                                        role === 1 && (
                                            <Dropdown.Item href="/admin" className='text-secondary'><i class="fa-solid fa-user-secret fa-beat"></i> Admin Page</Dropdown.Item>
                                        )
                                    }
                                    <Dropdown.Item onClick={handleLogout} className='text-danger'><i className="fa-solid fa-right-from-bracket fa-beat"></i> Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </>
                    ) : (
                        <li>
                            <Link to={'/login'} style={{ textDecoration: 'none' }}>
                                <button className='signin nav-links'>
                                    <i className='fa-solid fa-right-to-bracket fa-beat'></i> Sign In
                                </button>
                            </Link>
                        </li>
                    )
                }
            </ul>
        </nav>
    );
};
export default Navbar;