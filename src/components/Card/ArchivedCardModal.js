import {Badge, Button, Col, Dropdown, Modal, Row} from "react-bootstrap";
import {db} from "../../db";
import {useLiveQuery} from "dexie-react-hooks";
import {FaArrowRight} from "react-icons/fa";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import {GrTextAlignFull} from "react-icons/gr";
import {MdLabel, MdVideoLabel} from "react-icons/md";

const CardModal = (props) => {

    const [columns, setColumns] = useState(undefined);
    const [cardLabels, setCardLabels] = useState(undefined);

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

    return (
        <>
            <Modal show={props.show} className={props.className + ' text-black'} onHide={props.onHide} centered
                   size={'lg'}>
                <Modal.Header closeButton>
                    <Modal.Title><MdVideoLabel size={'22'}/> {props.card.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body className={'text-black'}>
                    <Row>
                        <Col md={8}>
                            <MdLabel size={'22'} className={'mb-1 text-muted'}/> Labels:
                            <div>
                                {
                                    cardLabels?.map(label => (
                                        <Badge className={'mx-1'} bg={''} key={label.id}
                                               style={{backgroundColor: label.color}}>
                                            {label.title}
                                        </Badge>
                                    ))
                                }
                            </div>
                            <div className={'mt-5'}>
                                <p><GrTextAlignFull size={'22'}/> Description:</p>
                                <p className={' px-2 col-11 descriptionField'}>{props.card.description}</p>
                            </div>
                        </Col>

                        <Col md={4} className={'d-flex flex-column'}>
                            <p className={'text-muted fw-bold'}>
                                Creator:
                                <br/>
                                <Button
                                    variant={'outline-dark'}
                                    className={'cardModal'}>
                                    {user?.username}
                                </Button>
                            </p>
                            <p className={'text-muted fw-bold mb-5'}>
                                Created At:
                                <br/>
                                <Button
                                    variant={'outline-dark'}
                                    className={'cardModal'}>
                                    {props.card.created_at}
                                </Button>
                            </p>
                            <p className={'text-muted fw-bold'}>Actions
                                <Dropdown>
                                    <Dropdown.Toggle variant={"outline-dark"} className={'cardModal mb-2'}>
                                        <FaArrowRight/> Move
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            columns?.map(column => (
                                                <Dropdown.Item key={column.id}
                                                               onClick={() => moveCard(column)}>{column.name}</Dropdown.Item>
                                            ))
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </p>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CardModal;