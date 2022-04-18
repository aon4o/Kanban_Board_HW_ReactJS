import {Button, Card, ListGroup, OverlayTrigger, Popover, Stack} from "react-bootstrap";
import {db} from "../../db";
import {useEffect, useState} from "react";
import AddCardModal from "../Card/AddCardModal";
import CardCard from "../Card/CardCard";
import DeleteColumnModal from "./DeleteColumnModal";
import EditColumnModal from "./EditColumnModal";
import {toast} from "react-toastify";
import {AiOutlinePlus} from "react-icons/ai";
import {RiMoreFill} from "react-icons/ri";
import ArchiveColumnModal from "./ArchiveColumnModal";


const ColumnCard = (props) => {

    const column = props.column;
    const [cards, setCards] = useState();
    const [addCardModalShow, setAddCardModalShow] = useState(false);
    const [editColumnModalShow, setEditColumnModalShow] = useState(false);
    const [deleteColumnModalShow, setDeleteColumnModalShow] = useState(false);
    const [archiveColumnModalShow, setArchiveColumnModalShow] = useState(false);
    const [rerenderColumn, setRerenderColumn] = useState(0);

    useEffect(() => {
        db.cards.where({column_id: props.column.id}).toArray()
            .then(setCards);
    }, [props.column.id, rerenderColumn])

    const addCard = () => {
        setAddCardModalShow(true);
    }

    const moveColumnLeft = async () => {
        try {

            if (column.position === 1) {
                throw new Error(`The column is already at the most left position!`);
            }

            await db.columns
                .where({position: column.position - 1, board_id: column.board_id})
                .modify({position: column.position});
            await db.columns
                .where({name: column.name, board_id: column.board_id})
                .modify({position: column.position - 1});

            await props.rerenderBoard();
        } catch (e) {
            toast.error(e);
        }
    }

    const moveColumnRight = async () => {
        try {
            if (!(await db.columns
                .where({position: column.position + 1, board_id: column.board_id})
                .first())) {
                throw new Error(`The column is already at the most right position!`);
            }

            await db.columns
                .where({position: column.position + 1, board_id: column.board_id})
                .modify({position: column.position});
            await db.columns
                .where({name: column.name, board_id: column.board_id})
                .modify({position: column.position + 1});

            await props.rerenderBoard();
        } catch (e) {
            toast.error(e);
        }
    }

    const editColumn = () => {
        setEditColumnModalShow(true);
    }

    const deleteColumn = () => {
        setDeleteColumnModalShow(true);
    }

    const archiveColumn = () => {
        setArchiveColumnModalShow(true);
    }

    const popover = (
        <Popover>
            <Popover.Header className={'text-black'} as="h3">Actions</Popover.Header>
            <Popover.Body className={'p-0'}>
                <ListGroup>
                    <ListGroup.Item action onClick={moveColumnLeft}>
                        Move Column Left
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={moveColumnRight}>
                        Move Column Right
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={editColumn}>
                        Rename Column
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={archiveColumn}>
                        Archive Column
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={deleteColumn}>
                        Delete Column
                    </ListGroup.Item>
                </ListGroup>
            </Popover.Body>
        </Popover>
    )

    return (
        <>
            <Card className={'scrollable-column columns mb-3'}>
                <Card.Header className={'border-0 header cardTitle'}>
                    <div className={'mb-1 d-flex justify-content-between align-items-center'}>
                        {props.column.name}
                        <OverlayTrigger trigger="focus" placement="right" overlay={popover}>
                            <Button variant="outline-secondary" className={'description'}><RiMoreFill/></Button>
                        </OverlayTrigger>
                    </div>
                </Card.Header>
                <Card.Body className={'cardBody'}>
                    <Stack gap={2}>
                        {
                            cards?.map(card => (
                                <CardCard
                                    key={card.id}
                                    card={card}
                                    labels={props.labels}
                                    rerenderColumn={() => setRerenderColumn(rerenderColumn + 1)}
                                    rerenderBoard={props.rerenderBoard}
                                    rerenderLabels={props.rerenderLabels}
                                />
                            ))
                        }
                    </Stack>
                </Card.Body>
                <Button className={'text-start pb-2 px-3 addCard'} variant={'outline-secondary'} size={'sm'}
                        onClick={addCard}>
                    <AiOutlinePlus/> Add card
                </Button>
            </Card>

            <AddCardModal
                show={addCardModalShow}
                onHide={() => setAddCardModalShow(false)}
                column={props.column}
                rerenderColumn={() => setRerenderColumn(rerenderColumn + 1)}
                className={'text-black'}
            />
            <EditColumnModal
                show={editColumnModalShow}
                onHide={() => setEditColumnModalShow(false)}
                column={props.column}
                rerenderBoard={() => props.rerenderBoard()}
            />
            <DeleteColumnModal
                show={deleteColumnModalShow}
                onHide={() => setDeleteColumnModalShow(false)}
                column={props.column}
                rerenderBoard={() => props.rerenderBoard()}
            />
            <ArchiveColumnModal
                show={archiveColumnModalShow}
                onHide={() => setArchiveColumnModalShow(false)}
                column={props.column}
                rerenderBoard={() => props.rerenderBoard()}
            />
        </>
    )
}

export default ColumnCard;