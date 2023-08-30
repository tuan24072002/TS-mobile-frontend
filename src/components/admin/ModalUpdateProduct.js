import React, { useCallback, useEffect, useRef, useState } from 'react'
import './ModalUpdateProduct.scss';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

const ModalUpdateProduct = (props) => {
    const { handleClose, show, getAllProduct, updateProduct } = props;
    const [nextOrBack, setNextOrBack] = useState(false);
    const [category, setCategory] = useState([]);
    const [color, setColor] = useState([]);
    const [ram, setRam] = useState([]);
    const [type, setType] = useState([]);
    const [memory, setMemory] = useState([]);
    const [pathNewImage, setPathNewImage] = useState('');
    const imageInputRef = useRef(null);
    const [dataProduct, setDataProduct] = useState([]);
    const handleImageClick = () => {
        imageInputRef.current.click();
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleUpdateImage(file);
    }
    const handleUpdateImage = async (file) => {
        const confirm = window.confirm('Are you sure update new product image ?');
        if (confirm) {
            const formData = new FormData();
            formData.append('product', file);
            await axios.post(`http://localhost:1234/upload-image/${updateProduct.id}`, formData)
                .then(res => {
                    if (res && res.data.upload_image === true) {
                        axios.get(`http://localhost:1234/phonebyid/${updateProduct.id}/${updateProduct.typeid}/${updateProduct.categoryid}/${updateProduct.colorid}/${updateProduct.memoryid}`)
                            .then(value => {
                                if (value && value.data) {
                                    setPathNewImage(value.data[0].image);
                                    alert(`Upload new product image successfully !!!`);
                                } else {
                                    setPathNewImage('');
                                }
                            }).catch(errValue => console.log(errValue));
                    } else {
                        alert(`Upload image failed !!!`);
                    }
                }).catch(err => console.log(err));
        }
    }
    useEffect(() => {
        setDataProduct(updateProduct);
    }, [updateProduct]);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (value !== updateProduct[name]) {
            setDataProduct((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };


    const handleNext = () => {
        setNextOrBack(true);
    }
    const handleBack = () => {
        setNextOrBack(false);
    }
    const handleSubmit = async () => {
        const requestBody = {
            name: dataProduct.name,
            categoryid: dataProduct.categoryid,
            typeid: dataProduct.typeid,
            memoryid: dataProduct.memoryid,
            ramid: dataProduct.ramid,
            inch: dataProduct.inch,
            colorid: dataProduct.colorid,
            quantity: dataProduct.quantity,
            price: dataProduct.price,
            cost: dataProduct.cost,
            screenTechnology: dataProduct.screenTechnology,
            operatingSystem: dataProduct.operatingSystem,
            screenResolution: dataProduct.screenResolution,
            screenFeature: dataProduct.screenFeature,
            rearCamera: dataProduct.rearCamera,
            frontCamera: dataProduct.frontCamera,
            sim: dataProduct.sim,
            pin: dataProduct.pin,
            chipset: dataProduct.chipset,
        };
        await axios.post(`http://localhost:1234/update-product/${updateProduct.id}`, requestBody)
            .then(res => {
                if (res && res.data.update_product === true) {
                    alert(`Update product successfully !!!`);
                    getAllProduct();
                    setNextOrBack(false);
                } else {
                    alert(`Update product failed !!!`);
                }
            }).catch(err => console.log(err));
        handleClose();
    }
    const general = useCallback(async () => {
        await axios.get(`http://localhost:1234/category`)
            .then(res => {
                if (res && res.data) {
                    setCategory(res.data);
                }
            }).catch(err => console.log(err));
        await axios.get(`http://localhost:1234/color`)
            .then(res => {
                if (res && res.data) {
                    setColor(res.data);
                }
            }).catch(err => console.log(err));
        await axios.get(`http://localhost:1234/type`)
            .then(res => {
                if (res && res.data) {
                    setType(res.data);
                }
            }).catch(err => console.log(err));
        await axios.get(`http://localhost:1234/memory`)
            .then(res => {
                if (res && res.data) {
                    setMemory(res.data);
                }
            }).catch(err => console.log(err));
        await axios.get(`http://localhost:1234/ram`)
            .then(res => {
                if (res && res.data) {
                    setRam(res.data);
                }
            }).catch(err => console.log(err));
    }, []);
    useEffect(() => {
        general();
    }, [general]);
    return (
        <div>
            <Modal show={show} onHide={handleClose} dialogClassName='modal-add-new '>
                <div className='title'>
                    <Modal.Header closeButton closeVariant='Black'>
                        <Modal.Title><b>Add new product</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='w-100'>
                            {
                                nextOrBack === false ? <>
                                    <div className='mb-3'>
                                        <label htmlFor='name' className='form-label'>Name</label>
                                        <input type='text' value={dataProduct.name} name='name' className='form-control' placeholder='Enter a Product Name' onChange={handleInputChange} />
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='category'>Category</label>
                                            <select className='form-control' name='categoryid' onChange={handleInputChange}>
                                                <option value="">Choose a category...</option>
                                                {
                                                    category.map((data) => (
                                                        <option key={data.categoryid} selected={dataProduct.categoryid === data.categoryid} value={data.categoryid}>{data.categoryname}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='type'>Type</label>
                                            <select className='form-control' name='typeid' onChange={handleInputChange}>
                                                <option value="">Choose a type...</option>
                                                {
                                                    type.map((data) => (
                                                        <option key={data.typeid} selected={dataProduct.typeid === data.typeid} value={data.typeid}>{data.typename}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='memory'>Memory</label>
                                            <select className='form-control' name='memoryid' onChange={handleInputChange}>
                                                <option value="">Choose a memory...</option>
                                                {
                                                    memory.map((data) => (
                                                        <option key={data.memoryid} selected={dataProduct.memoryid === data.memoryid} value={data.memoryid}>{data.memoryname}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='ram'>Ram</label>
                                            <select className='form-control' name='ramid' onChange={handleInputChange}>
                                                <option value="">Choose a ram...</option>
                                                {
                                                    ram.map((data) => (
                                                        <option key={data.ramid} selected={dataProduct.ramid === data.ramid} value={data.ramid}>{data.ramname}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='inch'>Inch</label>
                                        <input type='text' name='inch' value={dataProduct.inch} placeholder='Enter a Product Inch' className='form-control' onChange={handleInputChange} />
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='color'>Color</label>
                                            <select className='form-control' name='colorid' onChange={handleInputChange}>
                                                <option value=''>Choose a color...</option>
                                                {
                                                    color.map((data) => (
                                                        <option key={data.colorid} selected={dataProduct.colorid === data.colorid} value={data.colorid}>{data.colorname}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='quantity'>Quantity</label>
                                            <input type='number' min={'0'} name='quantity' value={dataProduct.quantity} className='form-control' onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='price'>Price</label>
                                            <input type='number' name='price' min={'0'} value={dataProduct.price} className='form-control' onChange={handleInputChange} />
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='cost'>Cost</label>
                                            <input type='number' name='cost' min={'0'} value={dataProduct.cost} className='form-control' onChange={handleInputChange} />
                                        </div>
                                    </div></> : <>
                                    <div className='mb-3'>
                                        <label htmlFor='screen_technology'>Screen Technology</label>
                                        <input type='text' value={dataProduct.screenTechnology} name='screenTechnology' placeholder='Enter a Product Screen Technology' onChange={handleInputChange} className='form-control' />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='operating_system'>Operating System</label>
                                        <input type='text' name='operatingSystem' value={dataProduct.operatingSystem} placeholder='Enter a Product Operating System' onChange={handleInputChange} className='form-control' />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='screen_resolution'>Screen Resolution</label>
                                        <input type='text' name='screenResolution' value={dataProduct.screenResolution} placeholder='Enter a Product Screen Resolution' onChange={handleInputChange} className='form-control' />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='screen_feature'>Screen Feature</label>
                                        <input type='text' name='screenFeature' value={dataProduct.screenFeature} placeholder='Enter a Product Screen Feature' onChange={handleInputChange} className='form-control' />
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='rear_camera'>Rear Camera</label>
                                            <input type='text' name='rearCamera' value={dataProduct.rearCamera} className='form-control' onChange={handleInputChange} placeholder='Enter a Product Rear Camera' />
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='front_camera'>Front Camera</label>
                                            <input type='text' name='frontCamera' value={dataProduct.frontCamera} className='form-control' onChange={handleInputChange} placeholder='Enter a Product Front Camera' />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='sim'>Sim</label>
                                            <input type='text' name='sim' value={dataProduct.sim} placeholder='Enter a Product Sim' onChange={handleInputChange} className='form-control' />
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='pin'>Pin</label>
                                            <input type='text' name='pin' value={dataProduct.pin} placeholder='Enter a Product Pin' onChange={handleInputChange} className='form-control' />
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='chipset'>Chipset</label>
                                        <input type='text' name='chipset' value={dataProduct.chipset} placeholder='Enter a Product Chipset' onChange={handleInputChange} className='form-control' />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='image'>Image</label>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div className='image-product' style={{ width: '100px', height: '100px' }}>
                                                {
                                                    pathNewImage !== '' ? <img src={`http://localhost:1234/images/${pathNewImage}`} onClick={handleImageClick} style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'contain' }} alt='' />
                                                        : <img src={`http://localhost:1234/images/${updateProduct.image}`} onClick={handleImageClick} style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'contain' }} alt='' />
                                                }
                                                <input type='file' name='image' className='form-control' ref={imageInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            <div className='action d-flex justify-content-center'>
                                {
                                    nextOrBack === false ? <button className='btn btn-secondary me-2' onClick={handleNext}>Next</button>
                                        : <button className='btn btn-secondary me-2' onClick={handleBack}>Back</button>
                                }
                                <button className='btn btn-secondary me-2' onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
        </div>
    )
}

export default ModalUpdateProduct