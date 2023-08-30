import React, { useCallback, useEffect, useState } from 'react'
import './ModalAddNewProduct.scss'
import { Modal } from 'react-bootstrap';
import axios from 'axios';
const ModalAddNewProduct = (props) => {
    const { handleClose, show, getAllProduct } = props;
    const [step1Values, setStep1Values] = useState({});
    const [step2Values, setStep2Values] = useState({});
    const [nextOrBack, setNextOrBack] = useState(false);
    const [category, setCategory] = useState([]);
    const [color, setColor] = useState([]);
    const [ram, setRam] = useState([]);
    const [type, setType] = useState([]);
    const [memory, setMemory] = useState([]);
    const [image, setImage] = useState(null);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (nextOrBack === false) {
            setStep1Values(prev => ({ ...prev, [name]: value }));
        } else {
            setStep2Values(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    }
    const handleNext = () => {
        setNextOrBack(true);
    }
    const handleBack = () => {
        setNextOrBack(false);
    }
    const handleSubmit = async () => {
        if (step1Values.name !== ''
            && step1Values.category !== ''
            && step1Values.type !== ''
            && step1Values.memory !== ''
            && step1Values.ram !== ''
            && step1Values.inch !== ''
            && step1Values.color !== ''
            && step1Values.quantity !== ''
            && step1Values.price !== ''
            && step1Values.cost !== ''
            && step2Values.screen_technology !== ''
            && step2Values.operating_system !== ''
            && step2Values.screen_resolution !== ''
            && step2Values.screen_feature !== ''
            && step2Values.rear_camera !== ''
            && step2Values.front_camera !== ''
            && step2Values.sim !== ''
            && step2Values.pin !== ''
            && step2Values.chipset !== ''
            && image !== null) {
            const formData = new FormData();
            formData.append('product', image);
            const requestBody = {
                name: step1Values.name,
                categoryid: step1Values.category,
                typeid: step1Values.type,
                memoryid: step1Values.memory,
                ramid: step1Values.ram,
                inch: step1Values.inch,
                colorid: step1Values.color,
                quantity: step1Values.quantity,
                price: step1Values.price,
                cost: step1Values.cost,
                screenTechnology: step2Values.screen_technology,
                operatingSystem: step2Values.operating_system,
                screenResolution: step2Values.screen_resolution,
                screenFeature: step2Values.screen_feature,
                rearCamera: step2Values.rear_camera,
                frontCamera: step2Values.front_camera,
                sim: step2Values.sim,
                pin: step2Values.pin,
                chipset: step2Values.chipset,
            };

            for (const key in requestBody) {
                formData.append(key, requestBody[key]);
            }

            await axios
                .post('http://localhost:1234/add-new-product', formData)
                .then(res => {
                    if (res && res.data.add_new_product === true) {
                        alert('Add new product successfully !!!');
                        getAllProduct();
                    } else {
                        alert('Add new product failed !!!');
                    }
                })
                .catch(err => console.log(err));

            setStep1Values({});
            setStep2Values({});
            handleClose();
        } else {
            alert(`You must fill all information !!!`);
        }
    };

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
                                        <input type='text' value={step1Values.name} name='name' className='form-control' placeholder='Enter a Product Name' onChange={handleInputChange} />
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='category'>Category</label>
                                            <select className='form-control' value={step1Values.category} name='category' onChange={handleInputChange}>
                                                <option value="">Choose a category...</option>
                                                {
                                                    category.map((data) => (
                                                        <option value={data.categoryid}>{data.categoryname}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='type'>Type</label>
                                            <select className='form-control' value={step1Values.type} name='type' onChange={handleInputChange}>
                                                <option value="">Choose a type...</option>
                                                {
                                                    type.map((data) => (
                                                        <option value={data.typeid}>{data.typename}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='memory'>Memory</label>
                                            <select className='form-control' value={step1Values.memory} name='memory' onChange={handleInputChange}>
                                                <option value="">Choose a memory...</option>
                                                {
                                                    memory.map((data) => (
                                                        <option value={data.memoryid}>{data.memoryname}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='ram'>Ram</label>
                                            <select className='form-control' name='ram' value={step1Values.ram} onChange={handleInputChange}>
                                                <option value="">Choose a ram...</option>
                                                {
                                                    ram.map((data) => (
                                                        <option value={data.ramid}>{data.ramname}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='inch'>Inch</label>
                                        <input type='text' name='inch' value={step1Values.inch} placeholder='Enter a Product Inch' className='form-control' onChange={handleInputChange} />
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='color'>Color</label>
                                            <select className='form-control' name='color' value={step1Values.color} onChange={handleInputChange}>
                                                <option value=''>Choose a color...</option>
                                                {
                                                    color.map((data) => (
                                                        <option value={data.colorid}>{data.colorname}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='quantity'>Quantity</label>
                                            <input type='number' min={'0'} name='quantity' value={step1Values.quantity} className='form-control' onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='price'>Price</label>
                                            <input type='number' name='price' min={'0'} value={step1Values.price} className='form-control' onChange={handleInputChange} />
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='cost'>Cost</label>
                                            <input type='number' name='cost' min={'0'} value={step1Values.cost} className='form-control' onChange={handleInputChange} />
                                        </div>
                                    </div></> : <>
                                    <div className='mb-3'>
                                        <label htmlFor='screen_technology'>Screen Technology</label>
                                        <input type='text' value={step2Values.screen_technology} name='screen_technology' placeholder='Enter a Product Screen Technology' onChange={handleInputChange} className='form-control' />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='operating_system'>Operating System</label>
                                        <input type='text' name='operating_system' value={step2Values.operating_system} placeholder='Enter a Product Operating System' onChange={handleInputChange} className='form-control' />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='screen_resolution'>Screen Resolution</label>
                                        <input type='text' name='screen_resolution' value={step2Values.screen_resolution} placeholder='Enter a Product Screen Resolution' onChange={handleInputChange} className='form-control' />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='screen_feature'>Screen Feature</label>
                                        <input type='text' name='screen_feature' value={step2Values.screen_feature} placeholder='Enter a Product Screen Feature' onChange={handleInputChange} className='form-control' />
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='rear_camera'>Rear Camera</label>
                                            <input type='text' name='rear_camera' value={step2Values.rear_camera} className='form-control' onChange={handleInputChange} placeholder='Enter a Product Rear Camera' />
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='front_camera'>Front Camera</label>
                                            <input type='text' name='front_camera' value={step2Values.front_camera} className='form-control' onChange={handleInputChange} placeholder='Enter a Product Front Camera' />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='sim'>Sim</label>
                                            <input type='text' name='sim' value={step2Values.sim} placeholder='Enter a Product Sim' onChange={handleInputChange} className='form-control' />
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor='pin'>Pin</label>
                                            <input type='text' name='pin' value={step2Values.pin} placeholder='Enter a Product Pin' onChange={handleInputChange} className='form-control' />
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='chipset'>Chipset</label>
                                        <input type='text' name='chipset' value={step2Values.chipset} placeholder='Enter a Product Chipset' onChange={handleInputChange} className='form-control' />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='image'>Image</label>
                                        <input type='file' name='image' className='form-control' onChange={handleFileChange} />
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

export default ModalAddNewProduct