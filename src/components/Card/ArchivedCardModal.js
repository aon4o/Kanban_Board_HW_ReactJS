import {Badge, Button, Col, Dropdown, Modal, Row} from "react-bootstrap";
import {db} from "../../db";
import {useLiveQuery} from "dexie-react-hooks";
import {FaArrowRight, FaTrash} from "react-icons/fa";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import DeleteCardModal from "./DeleteCardModal";

const CardModal = (props) => {

    const [columns, setColumns] = useState(undefined);
    const [cardLabels, setCardLabels] = useState(undefined);
    const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);

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

        db.card_labels.where({card_id: props.card.id}).toArray()
            .then(cardLabels => {
                const cardLabelIds = [];
                cardLabels.map(cardLabel => cardLabelIds.push(cardLabel.label_id));
                db.labels.bulkGet(cardLabelIds)
                    .then(setCardLabels)
                    .catch(toast.error);
            })
            .catch(toast.error);
    }, [props.card])


    const moveCard = (column) => {
        try {
            db.cards.where({id: props.card.id}).modify({column_id: column.id});
            toast.success(`Card '${props.card.title}' successfully moved to Column '${column.name}'!`);
            props.rerenderBoard();
        } catch (error) {
            toast.error(error);
        }
    }

    const deleteCard = () => {
        setShowDeleteCardModal(true);
    }

    return (
        <>
            <Modal show={props.show} className={props.className} onHide={props.onHide} centered size={'lg'}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.card.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body className={'text-black'}>
                    <Row>
                        <Col md={8}>
                            <div>
                                <p>
                                    Labels:
                                </p>
                                <div>
                                    {
                                        cardLabels?.map(label => (
                                            <Badge bg={''} key={label.id} style={{backgroundColor: label.color}}>
                                                {label.title}
                                            </Badge>
                                        ))
                                    }
                                </div>
                            </div>
                            <div>
                                <p>Description:</p>
                                <p>{props.card.description}</p>
                            </div>
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
                                            <Dropdown.Item key={column.id} onClick={() => moveCard(column)}>{column.name}</Dropdown.Item>
                                        ))
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                            <Button variant={'outline-danger'} onClick={deleteCard}><FaTrash/> Delete</Button>
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

            <DeleteCardModal
                card={props.card}
                show={showDeleteCardModal}
                onHide={() => setShowDeleteCardModal(false)}
                hideCardModal={props.onHide}
                rerender={props.rerender}
            />
        </>
    )
}

export default CardModal;