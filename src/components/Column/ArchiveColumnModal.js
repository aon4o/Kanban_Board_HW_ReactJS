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
            <Modal show={props.show} className={props.className + ' text-dark'} onHide={props.onHide} centered>
                <Form onSubmit={archiveColumn}>
                    <Modal.Header closeButton>
                        <Modal.Title>Archive Column</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Do you want to archive the Column named: ''{props.column.name}''?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'dark'} onClick={archiveColumn}>Archive</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default ArchiveColumnModal;