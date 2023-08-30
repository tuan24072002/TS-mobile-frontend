import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import './ModalWarning.scss';

const ModalWarning = (props) => {
    const { handleClose, show } = props;
    return (
        <>
            <Modal show={show} onHide={handleClose} dialogClassName="modal-dialog-centered">
                <div className='title'>
                    <Modal.Header closeButton closeVariant='white'>
                        <Modal.Title><b >Notification</b></Modal.Title>
                    </Modal.Header>
                </div>
                <Modal.Body>
                    <p>If you want to buy in bulk, please contact the corporate sales department</p>
                    <p><b>Mr.Tuan</b>: 0587.928.264</p>
                    <p><b>Email</b>: 0995086534ts@gmail.com</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalWarning