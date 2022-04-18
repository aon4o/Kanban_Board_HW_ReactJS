import {Alert, Button, Form, Modal} from "react-bootstrap";
import {db} from "../../db";
import {toast} from "react-toastify";


const ArchiveColumnModal = (props) => {

    const archiveColumn = async () => {
        try {
            const archivedCards = await db.cards
                .where({column_id: props.column.id})
                .modify({column_id: 'archived'});

            await db.columns.delete(props.column.id);

            await db.columns
                .where('position')
                .above(props.column.position)
                .modify(column => column.position -= 1);

            toast.success(`Column '${props.column.name}' deleted successfully and ${archivedCards} cards were archived!`);
            props.rerenderBoard();
            props.onHide();
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <>
            <Modal show={props.show} className={props.className} onHide={props.onHide} centered>
                <Form onSubmit={archiveColumn}>
                    <Modal.Header closeButton>
                        <Modal.Title>Archive a Column</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert className={"text-center"} variant={'danger'}>
                            <Alert.Heading>
                                Are you sure you want to archive the Column with name '{props.column.name}'!
                            </Alert.Heading>
                            <p>
                                With this action, all of the Cards in the Column will be archived!
                            </p>
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'danger'} onClick={archiveColumn}>Archive</Button>
                        <Button variant={'secondary'} onClick={props.onHide}>Cancel</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default ArchiveColumnModal;