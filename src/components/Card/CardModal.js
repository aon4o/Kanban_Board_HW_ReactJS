import {Badge, Button, Col, Dropdown, Modal, Row} from "react-bootstrap";
import {db} from "../../db";
import {useLiveQuery} from "dexie-react-hooks";
import {FaArchive, FaArrowRight, FaEdit} from "react-icons/fa";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import EditCardModal from "./EditCardModal";
import AddLabelModal from "../Label/AddLabelModal";
import {GrTextAlignFull} from "react-icons/gr";
import {MdLabel, MdVideoLabel} from "react-icons/md";
import {AiOutlinePlus} from "react-icons/ai";

const CardModal = (props) => {

    const [columns, setColumns] = useState(undefined);
    const [cardLabels, setCardLabels] = useState(undefined);
    const [users, setUsers] = useState(undefined);
    const [cardAssignee, setCardAssignee] = useState({username: "Nobody"});
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

    const archiveCard = () => {
        try {
            db.cards.where({id: props.card.id}).modify({column_id: 'archived'});
            props.rerenderColumn();
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
            props.rerenderColumn();
        } catch (error) {
            toast.error(error);
        }
    }

    function changeCardAssignee(user) {
        db.cards.where({id: props.card.id})
            .modify({assignee_id: user.id})
            .then(() => {
                toast.success(`User '${user.username}' assigned to Card '${props.card.title}' successfully!`);
                props.rerenderColumn();
            })
            .catch(toast.error);
    }

    function removeCardAssignee() {
        db.cards.where({id: props.card.id})
            .modify({assignee_id: undefined})
            .then(() => {
                toast.success(`Assignee removed on Card '${props.card.title}' successfully!`);
                props.rerenderColumn();
            })
            .catch(toast.error);
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
                            <div>
                                <p>
                                    <MdLabel size={'22'} className={'mb-1 text-muted'}/> Labels:
                                    <div>
                                        {
                                            cardLabels?.map(label => (
                                                <Badge className={'mx-1'} bg={''} key={label.id} style={{backgroundColor: label.color}}>
                                                    {label.title}
                                                </Badge>
                                            ))
                                        }
                                    </div>
                                    <Dropdown>
                                        <Dropdown.Toggle variant={'outline-dark'} size={'sm'}
                                                         className={'description mt-2 mb-4'}>
                                            <AiOutlinePlus/> Add Label
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className={'dropdownItem'}>
                                            {
                                                props.labels && props.labels.length !== 0 ?
                                                    props.labels.map(label => (
                                                        <Dropdown.Item className={'dropdownItem'} key={label.id}
                                                                       onClick={() => addLabelToCard(label)}>
                                                            {label.title}
                                                        </Dropdown.Item>
                                                    ))
                                                    :
                                                    <></>
                                            }
                                            <Dropdown.Divider/>
                                            <Dropdown.Item onClick={addNewLabel}>Add New Label</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </p>
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
                                    variant={'outline-dark'}
                                    className={'cardModal'}>
                                    {user?.username}
                                </Button>
                            </p>
                            <p className={'text-muted fw-bold'}>
                                Created At:
                                <br/>
                                <Button
                                    variant={'outline-dark'}
                                    className={'cardModal'}>
                                    {props.card.created_at}
                                </Button>
                            </p>
                            <p className={'text-muted fw-bold mb-5'}>
                                Assigned to:
                                <Dropdown>
                                    <Dropdown.Toggle className={'dropdownMenu'}>
                                        {cardAssignee.username}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={removeCardAssignee}>Nobody</Dropdown.Item>
                                        {
                                            users?.map(user => (
                                                <>
                                                    <Dropdown.Divider/>
                                                    <Dropdown.Item onClick={() => changeCardAssignee(user)}>
                                                        {user.username}
                                                    </Dropdown.Item>
                                                </>
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
                rerenderColumn={props.rerenderColumn}
            />
            <AddLabelModal
                card={props.card}
                show={showAddNewLabelModal}
                onHide={() => setShowAddNewLabelModal(false)}
                rerenderLabels={props.rerenderLabels}
            />
        </>
    )
}

export default CardModal;