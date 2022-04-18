import {Alert, Button, Form, Modal} from "react-bootstrap";
import {db} from "../../db";
import {toast} from "react-toastify";


const DeleteColumnModal = (props) => {

    const deleteColumn = async () => {
        try {
            const deletedCards = await db.cards.where({column_id: props.column.id}).delete()
            await db.columns.delete(props.column.id);
            await db.columns
                .where('position')
                .above(props.column.position)
                .modify(column => column.position -= 1);
            toast.success(`Column '${props.column.name}' deleted successfully with ${deletedCards} cards!`);
            props.rerenderBoard();
            props.onHide();
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <>
            <Modal show={props.show} className={props.className + ' text-dark'} onHide={props.onHide} centered>
                <Form onSubmit={deleteColumn}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Column</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Do you want to delete the Column named: ''{props.column.name}''?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'danger'} onClick={deleteColumn}>Yes</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default DeleteColumnModal;