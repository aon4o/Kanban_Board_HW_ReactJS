import {Button, Card, Stack} from "react-bootstrap";
import {db} from "../../db";
import {FaArrowLeft, FaArrowRight, FaEdit, FaPlus, FaTrash} from "react-icons/fa";
import {useEffect, useState} from "react";
import AddCardModal from "../Card/AddCardModal";
import CardCard from "../Card/CardCard";
import {toast} from "react-toastify";


const ColumnCard = (props) => {

    const [addCardShow, setAddCardShow] = useState(false);
    const [cards, setCards] = useState();

    useEffect(() => {
        db.cards.where({column_id: props.column.id}).toArray()
            .then(setCards);
    }, [props.column.id])

    const addCard = () => {
        setAddCardShow(true)
    }

    const moveColumnLeft = () => {

    }

    const moveColumnRight = () => {

    }

    const editColumn = () => {

    }

    const deleteColumn = async () => {
        try {
            const deletedCards = await db.cards.where({column_id: props.column.id}).delete()
            await db.columns.delete(props.column.id);
            toast.success(`Column '${props.column.name}' deleted successfully with ${deletedCards} cards!`);
        } catch (error) {
            toast.error(error);
        }

    }

    return (
        <>
        <Card>
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
                    <Button disabled variant={'outline-warning'} size={'sm'} onClick={editColumn}>
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
                show={addCardShow}
                onHide={() => setAddCardShow(false)}
                column_id={props.column.id}
            />
        </>
    )
}

export default ColumnCard;