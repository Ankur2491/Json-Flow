import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Editor } from '@monaco-editor/react';


function ObjectNode(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            {/* <Button variant="info" onClick={handleShow} size="sm">
                View Object
            </Button> */}

            <div className="objNode" onClick={handleShow}>
                {Object.keys(props['objectValues']['value']).map((key,index)=> index<5 && 
                <p key={key} style={{color:'#6741d9'}}><small>{key}: <span style={{color:'#000000'}}> {String(props['objectValues']['value'][key])}</span></small></p>)}
                . . .<br/>
               <i class="fa fa-plus" aria-hidden="true"></i>(click to view whole json)

            </div>


            <Modal show={show} onHide={handleClose} scrollable={true}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Editor height={'60vh'} defaultLanguage='json' theme='vs-dark' defaultValue={JSON.stringify(props['objectValues']['value'], null, 2)} options={{ readOnly: true }} />
                </Modal.Body>
            </Modal>
        </>
    );

}

export default ObjectNode;
