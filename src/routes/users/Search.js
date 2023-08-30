import React, { useEffect, useState } from 'react';
import '../../styles/users/Product.scss';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Search = () => {
    const location = useLocation();
    const search = location.state.search;
    const navigate = useNavigate();
    const [dataSearch, setDataSearch] = useState([]);
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (search === '') {
            navigate('/product');
        }
        else {
            const reqBody = { value: search };
            axios.post(`http://localhost:1234/search-phone/`, reqBody)
                .then(res => {
                    if (res && res.data) {
                        setDataSearch(res.data);
                    } else {
                        setDataSearch([]);
                    }
                }).catch(err => console.log(err));
            axios.post(`http://localhost:1234/search-count`, reqBody)
                .then(res => {
                    if (res && res.data) {
                        setCount(res.data[0].count);
                    } else {
                        setCount(0);
                    }
                }).catch(err => console.log(err));
        }
    }, [search, navigate, count, setDataSearch]);
    return (
        <div className='container-fluid'>
            <div className='all-product'>
                <p className='result my-2 fs-4'>There are <b>{count}</b> search results</p>
                <div className='product'>
                    {dataSearch.map((data) => (
                        <div className='card-product' key={data.id}>
                            <Link style={{ textDecoration: "none", color: "#222" }} to={`/product/` + data.id + `/` + data.typeid + '/' + data.categoryid + '/' + data.colorid + '/' + data.memoryid}>
                                <div className='card-image'>
                                    <img src={`http://localhost:1234/images/${data.image}`} alt='' />
                                </div>
                                <div className='card-name'>
                                    <b>{data.name}</b>
                                </div>
                                <div className='card-feature'>
                                    <div className='item'>{data.inch}</div>
                                    <div className='item'>{data.ramname}</div>
                                    <div className='item'>{data.memoryname}</div>
                                </div>
                                <div className='price-cost'>
                                    <div className='price'>{data.price.toLocaleString()}đ</div>
                                    <div className='cost'>{data.cost.toLocaleString()}đ</div>
                                </div>
                                <div className='love'>
                                    <i className='fa-solid fa-heart'></i>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Search