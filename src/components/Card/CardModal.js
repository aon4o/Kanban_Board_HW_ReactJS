import {Button, Col, Dropdown, Modal, Row} from "react-bootstrap";
import {db} from "../../db";
import {useLiveQuery} from "dexie-react-hooks";
import {FaArchive, FaArrowRight, FaEdit, FaTrash} from "react-icons/fa";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";

const CardModal = (props) => {

    const [columns, setColumns] = useState(undefined);

    const user = useLiveQuery(() =>
        db.users.where({id: props.card.user_id}).first()
    )

    useEffect(() => {
        db.columns
            .where({board_id: props.card.board_id})
            .and(item => item.id !== props.card.column_id)
            .toArray()
            .then(setColumns)
            .catch(toast.error);
    }, [props.card])


    const moveCard = (column_id) => {
        toast(column_id);
    }

    const editCard = () => {
        toast('edit');
    }

    const deleteCard = () => {
        toast('delete');
    }

    const archiveCard = () => {
        toast('archive');
    }

    return (
        <>
            <Modal show={props.show} className={props.className} onHide={props.onHide} centered size={'lg'}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.card.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row>
                        <Col md={8}>
                            <p>Description:</p>
                            <p>{props.card.description}</p>
                        </Col>

                        <Col md={4} className={'d-flex flex-column gap-2'}>
                            <p>Actions</p>
                            <Dropdown>
                                <Dropdown.Toggle variant={"outline-secondary"}>
                                    <FaArrowRight/> Move
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {
                                        columns?.map(column => (
                                            <Dropdown.Item onClick={() => moveCard(column.id)}>{column.name}</Dropdown.Item>
                                        ))
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                            <Button variant={'outline-warning'} onClick={editCard}><FaEdit/> Edit</Button>
                            <Button variant={'outline-danger'} onClick={deleteCard}><FaTrash/> Delete</Button>
                            <Button variant={'outline-warning'} onClick={archiveCard}><FaArchive/> Archive</Button>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <span>
                        Created by - {user?.username}
                    </span>
                    <Button variant={'secondary'} onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CardModal;