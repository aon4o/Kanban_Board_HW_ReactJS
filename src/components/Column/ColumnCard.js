import {Button, Card, Stack} from "react-bootstrap";
import {db} from "../../db";
import {FaArrowLeft, FaArrowRight, FaEdit, FaPlus, FaTrash} from "react-icons/fa";
import {useEffect, useState} from "react";
import AddCardModal from "../Card/AddCardModal";
import CardCard from "../Card/CardCard";
import DeleteColumnModal from "./DeleteColumnModal";
import EditColumnModal from "./EditColumnModal";
import {toast} from "react-toastify";


const ColumnCard = (props) => {

    const column = props.column;
    const [cards, setCards] = useState();
    const [addCardModalShow, setAddCardModalShow] = useState(false);
    const [editColumnModalShow, setEditColumnModalShow] = useState(false);
    const [deleteColumnModalShow, setDeleteColumnModalShow] = useState(false);
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

            await props.rerender();
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

            await props.rerender();
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

    return (
        <>
        <Card className={'scrollable-column'}>
            <Card.Header>
                <div className={'mb-1'}>
                    {props.column.name}
                </div>

                <Stack direction={"horizontal"} gap={2} className={'float-end'}>
                    <Button variant={'outline-success'} size={'sm'} onClick={addCard}>
                        <FaPlus/>
                    </Button>
                    <Button
                        disabled={props.column.position === 1}
                        variant={'outline-primary'}
                        size={'sm'}
                        onClick={moveColumnLeft}
                    >
                        <FaArrowLeft/>
                    </Button>
                    <Button
                        variant={'outline-primary'}
                        size={'sm'}
                        onClick={moveColumnRight}
                    >
                        <FaArrowRight/>
                    </Button>
                    <Button variant={'outline-warning'} size={'sm'} onClick={editColumn}>
                        <FaEdit/>
                    </Button>
                    <Button variant={'outline-danger'} size={'sm'} onClick={deleteColumn}>
                        <FaTrash/>
                    </Button>
                </Stack>
            </Card.Header>
            <Card.Body>
                <Stack gap={3}>
                    {
                        cards?.map(card => (
                            <CardCard
                                key={card.id}
                                card={card}
                                rerender={() => setRerenderColumn(rerenderColumn + 1)}
                            />
                        ))
                    }
                </Stack>
            </Card.Body>
        </Card>

            <AddCardModal
                show={addCardModalShow}
                onHide={() => setAddCardModalShow(false)}
                column={props.column}
                rerender={() => setRerenderColumn(rerenderColumn + 1)}
            />
            <EditColumnModal
                show={editColumnModalShow}
                onHide={() => setEditColumnModalShow(false)}
                column={props.column}
                rerender={() => props.rerender(props.rerenderer + 1)}
            />
            <DeleteColumnModal
                show={deleteColumnModalShow}
                onHide={() => setDeleteColumnModalShow(false)}
                column={props.column}
                rerender={() => props.rerender(props.rerenderer + 1)}
            />
        </>
    )
}

export default ColumnCard;