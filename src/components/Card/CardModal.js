import {Alert, Badge, Button, Col, Dropdown, Modal, Row} from "react-bootstrap";
import {db} from "../../db";
import {useLiveQuery} from "dexie-react-hooks";
import {FaArchive, FaArrowRight, FaEdit, FaPlus, FaTrash} from "react-icons/fa";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import DeleteCardModal from "./DeleteCardModal";
import EditCardModal from "./EditCardModal";
import AddLabelModal from "../Label/AddLabelModal";
import {GrTextAlignFull} from "react-icons/gr";

const CardModal = (props) => {

    const [columns, setColumns] = useState(undefined);
    const [cardLabels, setCardLabels] = useState(undefined);
    const [boardLabels, setBoardLabels] = useState(undefined);
    const [users, setUsers] = useState(undefined);
    const [cardAssignee, setCardAssignee] = useState({username: "Nobody"});
    const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
    const [showEditCardModal, setShowEditCardModal] = useState(false);
    const [showAddNewLabelModal, setShowAddNewLabelModal] = useState(false);

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

        db.labels.where({board_id: props.card.board_id}).toArray()
            .then(setBoardLabels)
            .catch(toast.error);

        if (props.card.assignee_id) {
            db.users.where({id: props.card.assignee_id}).first()
                .then(setCardAssignee)
                .catch(toast.error);
        } else {
            setCardAssignee({username: "Nobody"});
        }

        db.users.toArray()
            .then(setUsers)
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

    const editCard = () => {
        setShowEditCardModal(true);
    }

    const deleteCard = () => {
        setShowDeleteCardModal(true);
    }

    const archiveCard = () => {
        try {
            db.cards.where({id: props.card.id}).modify({column_id: 'archived'});
            props.rerender();
            toast.success(`Card '${props.card.title}' successfully archived!`);
        } catch (error) {
            toast.error(error);
        }
    }

    const addNewLabel = () => {
        setShowAddNewLabelModal(true);
    }

    const addLabelToCard = async (label) => {
        try {
            const cardLabel = await db.card_labels
                .where({card_id: props.card.id, label_id: label.id}).first();

            if (cardLabel) {
                throw new Error("The Card already has this Label!");
            }

            await db.card_labels.add({
                card_id: props.card.id,
                label_id: label.id,
            })

            toast.success(`Label '${label.title}' successfully added to Card '${props.card.title}'.`)
            props.rerender();
        } catch (error) {
            toast.error(error);
        }
    }

    function changeCardAssignee(user) {
        db.cards.where({id: props.card.id})
            .modify({assignee_id: user.id})
            .then(() => {
                toast.success(`User '${user.username}' assigned to Card '${props.card.title}' successfully!`);
                props.rerender();
            })
            .catch(toast.error);
    }

    function removeCardAssignee() {
        db.cards.where({id: props.card.id})
            .modify({assignee_id: undefined})
            .then(() => {
                toast.success(`Assignee removed on Card '${props.card.title}' successfully!`);
                props.rerender();
            })
            .catch(toast.error);
    }

    return (
        <>
            <Modal show={props.show} className={props.className + ' text-black'} onHide={props.onHide} centered
                   size={'lg'}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.card.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body className={'text-black'}>
                    <Row>
                        <Col md={8}>
                            <div>
                                <p>
                                    Labels:
                                    <Dropdown>
                                        <Dropdown.Toggle variant={'outline-secondary'}>
                                            <FaPlus/>Add Label
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {
                                                boardLabels && boardLabels.length !== 0 ?
                                                    boardLabels.map(label => (
                                                        <Dropdown.Item key={label.id}
                                                                       onClick={() => addLabelToCard(label)}>
                                                            {label.title}
                                                        </Dropdown.Item>
                                                    ))
                                                    :
                                                    <Alert>
                                                        There are no Labels for this Board yet!
                                                    </Alert>
                                            }
                                            <Dropdown.Divider/>
                                            <Dropdown.Item onClick={addNewLabel}>Add New Label</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
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
                                <p><GrTextAlignFull size={'22'}/> Description:</p>
                                <p className={' px-2 col-11 descriptionField'}>{props.card.description}</p>
                            </div>
                        </Col>

                        <Col className={'d-flex flex-column'}>
                            <p className={'text-muted fw-bold'}>
                                Creator:
                                <br/>
                                <Button
                                    variant={'outline-dark mb-5'}
                                    className={'cardModal'}>
                                    {user?.username}
                                </Button>
                            </p>
                            <p className={'text-muted fw-bold mb-4'}>
                                Assigned to:
                                <Dropdown>
                                    <Dropdown.Toggle>
                                        {cardAssignee.username}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={removeCardAssignee}>Nobody</Dropdown.Item>
                                        {
                                            users?.map(user => (
                                                <Dropdown.Item onClick={() => changeCardAssignee(user)}>
                                                    {user.username}
                                                </Dropdown.Item>
                                            ))
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
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
                                <Button variant={'outline-dark'} className={'cardModal mb-2'}
                                        onClick={editCard}><FaEdit/> Edit</Button>
                                <Button variant={'outline-dark'} className={'cardModal mb-2'}
                                        onClick={deleteCard}><FaTrash/> Delete</Button>
                                <Button
                                    variant={'outline-dark'}
                                    className={'cardModal mb-2'}
                                    onClick={archiveCard}>
                                    <FaArchive/> Archive
                                </Button>
                            </p>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

            <EditCardModal
                card={props.card}
                show={showEditCardModal}
                onHide={() => setShowEditCardModal(false)}
                rerender={props.rerender}
            />

            <DeleteCardModal
                card={props.card}
                show={showDeleteCardModal}
                onHide={() => setShowDeleteCardModal(false)}
                hideCardModal={props.onHide}
                rerender={props.rerender}
            />

            <AddLabelModal
                card={props.card}
                show={showAddNewLabelModal}
                onHide={() => setShowAddNewLabelModal(false)}
                rerender={props.rerender}
            />
        </>
    )
}

export default CardModal;