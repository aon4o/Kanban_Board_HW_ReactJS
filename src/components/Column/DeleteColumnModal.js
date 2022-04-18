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
            <Modal show={props.show} className={props.className} onHide={props.onHide} centered>
                <Form onSubmit={deleteColumn}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete a Column</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert className={"text-center"} variant={'danger'}>
                            <Alert.Heading>
                                Are you sure you want to delete the Column with name '{props.column.name}'!
                            </Alert.Heading>
                            <p>
                                With the deletion of the Column, the Cards in it will be deleted, too!
                                <br/>
                                This action is not reversible!
                            </p>
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'danger'} onClick={deleteColumn}>Delete</Button>
                        <Button variant={'secondary'} onClick={props.onHide}>Cancel</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default DeleteColumnModal;