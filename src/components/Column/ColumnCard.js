import {Button, Card, Stack} from "react-bootstrap";
import {db} from "../../db";
import {FaArrowLeft, FaArrowRight, FaEdit, FaPlus, FaTrash} from "react-icons/fa";
import {useEffect, useState} from "react";
import AddCardModal from "../Card/AddCardModal";
import CardCard from "../Card/CardCard";
import DeleteColumnModal from "./DeleteColumnModal";
import EditColumnModal from "./EditColumnModal";


const ColumnCard = (props) => {

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

    const moveColumnLeft = () => {

    }

    const moveColumnRight = () => {

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
            <Card.Header className={''}>
                <div className={'mb-1'}>
                    {props.column.name}
                </div>

                <Stack direction={"horizontal"} gap={2} className={'float-end'}>
                    <Button variant={'outline-success'} size={'sm'} onClick={addCard}>
                        <FaPlus/>
                    </Button>
                    <Button disabled variant={'outline-primary'} size={'sm'} onClick={moveColumnLeft}>
                        <FaArrowLeft/>
                    </Button>
                    <Button disabled variant={'outline-primary'} size={'sm'} onClick={moveColumnRight}>
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
                            <CardCard key={card.id} card={card}/>
                        ))
                    }
                </Stack>
            </Card.Body>
        </Card>

            <AddCardModal
                show={addCardModalShow}
                onHide={() => setAddCardModalShow(false)}
                column_id={props.column.id}
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