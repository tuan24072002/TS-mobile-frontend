import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import '../../styles/admin/ProductAdmin.scss';
import ModalAddNewProduct from '../../components/admin/ModalAddNewProduct';
import ModalUpdateProduct from '../../components/admin/ModalUpdateProduct';
import SideBar from '../../components/admin/SideBar';

const ProductManagement = () => {
    const [getAll, setGetAll] = useState([]);
    const [showModalAddNew, setShowModalAddNew] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [updateProduct, setUpdateProduct] = useState([]);
    const handleCloseModalAddNew = () => {
        setShowModalAddNew(false);
    }
    const handleCloseModalUpdate = () => {
        setShowModalUpdate(false);
    }
    const handleClickShowModalUpdate = (product) => {
        setShowModalUpdate(true);
        setUpdateProduct(product);
    }
    const getAllProduct = useCallback(async () => {
        await axios.get(`http://localhost:1234/phone`)
            .then(res => {
                if (res && res.data) {
                    setGetAll(res.data);
                } else {
                    setGetAll([]);
                }
            }).catch(err => console.log(err));
    }, []);
    useEffect(() => {
        getAllProduct();
    }, [getAllProduct]);
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure to delete this product?');
        if (confirmed) {
            await axios.delete(`http://localhost:1234/delete-product/${id}`)
                .then(res => {
                    if (res && res.data.delete_product === false) {
                        alert(`Delete product failed !!!`);
                    }
                    else if (res && res.data.delete_product === true) {
                        getAllProduct();
                        alert('Delete product successfully !!!');
                    }
                }).catch(err => console.log(err));
        }
    }
    let stt = 1;
    return (
        <div className='all-admin'>
            <div className='container-fluid bg-white'>
                <div className='row'>
                    <div className='col-2 bg-white border'>
                        <SideBar />
                    </div>
                    <div className='col-10 p-0'>
                        <div className='all-product-management container-fluid p-0 bg-white'>
                            <div className='top d-flex  p-2'>
                                <p className='fs-3 fw-bold me-5'>Product Management</p>
                                <button className='btn btn-success' onClick={() => setShowModalAddNew(true)}>Add new product</button>
                            </div>
                            <table className='table'>
                                <thead>
                                    <tr className='text-center'>
                                        <th>.No</th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Cost</th>
                                        <th>Quantity</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        getAll.map((product) => (
                                            <tr key={product.id} className='text-center'>
                                                <td>{stt++}</td>
                                                <td className='d-flex' style={{ justifyContent: 'center' }}>
                                                    <div style={{ width: '100px', height: '100px' }}>
                                                        <img src={`http://localhost:1234/images/${product.image}`} alt='' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                    </div>
                                                </td>
                                                <td>{product.name}</td>
                                                <td>{product.price.toLocaleString()}đ</td>
                                                <td>{product.cost.toLocaleString()}đ</td>
                                                <td>{product.quantity}</td>
                                                <td><button className='btn btn-primary' onClick={() => handleClickShowModalUpdate(product)}>Update</button> / <button className='btn btn-danger' onClick={() => handleDelete(product.id)}>Delete</button></td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            <ModalUpdateProduct show={showModalUpdate} handleClose={handleCloseModalUpdate} getAllProduct={getAllProduct} updateProduct={updateProduct} />
                            <ModalAddNewProduct show={showModalAddNew} handleClose={handleCloseModalAddNew} getAllProduct={getAllProduct} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductManagement