import React, { useCallback, useEffect, useState } from 'react';
import '../../styles/users/Product.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Product = ({ scrollToTop }) => {
    const [product, setProduct] = useState([]);
    const [sortedProduct, setSortedProduct] = useState([]);
    const [series, setSeries] = useState([]);
    const [isProduct, setIsProduct] = useState(true);
    const [isSorted, setIsSorted] = useState(false);
    const [isSeries, setIsSeries] = useState(false);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [pagination, setPagination] = useState([]);
    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPage) setPage(page + 1);
    };

    const renderPagination = useCallback(() => {
        let paginationItems = [];
        for (let i = 1; i <= totalPage; i++) {
            paginationItems.push(
                <Link
                    to='#'
                    key={i}
                    className={i === page ? 'active' : ''}
                    onClick={() => setPage(i)}
                >
                    {i}
                </Link>
            );
            setPagination(paginationItems);
        }
    }, [totalPage, page]);

    useEffect(() => {
        const fetchDataPerPage = async () => {
            try {
                const res = await axios.get(`http://localhost:1234/phone-perpage/${page}`);
                setProduct(res.data);
                setIsSorted(false);
                setIsSeries(false);
                setIsProduct(true);
            } catch (err) {
                console.log(err);
            }
        };

        fetchDataPerPage();
    }, [page]);

    useEffect(() => {
        const fetchTotalPage = async () => {
            try {
                const res = await axios.get('http://localhost:1234/phone-totalpage/');
                setTotalPage(Math.ceil(res.data[0].total / 12));
                renderPagination();
            } catch (err) {
                console.log(err);
            }
        };

        fetchTotalPage();
    }, [renderPagination]);

    const sortASC = async () => {
        try {
            let url = 'http://localhost:1234/phone-sort/asc';
            if (selectedSeries) {
                url = `http://localhost:1234/phone-series-sort/${selectedSeries}/asc`;
            }
            const res = await axios.get(url);
            setSortedProduct(res.data);
            setIsSorted(true);
            setIsSeries(false);
            setIsProduct(false);
        } catch (err) {
            console.log(err);
        }
    };

    const sortDESC = async () => {
        try {
            let url = 'http://localhost:1234/phone-sort/desc';
            if (selectedSeries) {
                url = `http://localhost:1234/phone-series-sort/${selectedSeries}/desc`;
            }
            const res = await axios.get(url);
            setSortedProduct(res.data);
            setIsSorted(true);
            setIsSeries(false);
            setIsProduct(false);
        } catch (err) {
            console.log(err);
        }
    };

    const bySeries = async (id) => {
        try {
            const res = await axios.get(`http://localhost:1234/phone-series/${id}`);
            setSeries(res.data);
            setSelectedSeries(id);
            setIsSorted(false);
            setIsSeries(true);
            setIsProduct(false);
        } catch (err) {
            console.log(err);
        }
    };

    const normal = async () => {
        try {
            const res = await axios.get(`http://localhost:1234/phone-perpage/${page}`);
            setProduct(res.data);
            setIsSorted(false);
            setIsSeries(false);
            setIsProduct(true);
        } catch (err) {
            console.log(err);
        }
    };
    const showProductList = isSorted ? sortedProduct : isSeries ? series : isProduct ? product : null;

    return (
        <div className='container-fluid'>
            <div className='all-product'>
                <div className='iphone-series'>
                    <button onClick={() => bySeries(1)} className='btn btn-light border my-2'>
                        IPHONE 14 SERIES
                    </button>
                    <button onClick={() => bySeries(2)} className='btn btn-light border mx-2'>
                        IPHONE 13 SERIES
                    </button>
                    <button onClick={() => bySeries(3)} className='btn btn-light border mx-2'>
                        IPHONE 12 SERIES
                    </button>
                    <button onClick={() => bySeries(4)} className='btn btn-light border mx-2'>
                        IPHONE 11 SERIES
                    </button>
                </div>
                <div className='sort'>
                    <b>Sort by price</b>
                    <div className='icon-sort'>
                        <div className='sort-desc my-2'>
                            <button className='btn btn-light border' onClick={() => sortDESC()}>
                                <i className='fa-solid fa-arrow-down-wide-short' style={{ color: '#000000' }}></i>
                                High - Low
                            </button>
                        </div>
                        <div className='sort-asc mx-2 my-2'>
                            <button className='btn btn-light border' onClick={() => sortASC()}>
                                <i className='fa-solid fa-arrow-down-short-wide' style={{ color: '#000000' }}></i>
                                Low - High
                            </button>
                        </div>
                        <div className='refresh mx-2 my-2'>
                            <button className='btn btn-light border' onClick={normal}>
                                <i className='fa-solid fa-arrows-rotate' style={{ color: '#000000' }}></i>
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
                <div className='product'>
                    {showProductList.map((data) => (
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
                                {
                                    data.quantity > 0 ? <></>
                                        : <div className='sold-out'>
                                            <img src={`http://localhost:1234/icon/sold.png`} alt='' />
                                        </div>
                                }
                            </Link>
                        </div>
                    ))}
                </div>
                {
                    !isSeries && !isSorted &&
                    (
                        <div className='pagination' onClick={scrollToTop}>
                            <Link to='#' onClick={handlePrev}>
                                Prev
                            </Link>
                            {pagination}
                            <Link to='#' onClick={handleNext}>
                                Next
                            </Link>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Product;