import {Alert, Button, Form, Modal} from "react-bootstrap";
import {db} from "../../db";
import {toast} from "react-toastify";


const DeleteCardModal = (props) => {

    const deleteCard = async () => {
        try {
            await db.cards.delete(props.card.id);
            toast.success(`Card '${props.card.title}' deleted successfully!`);
            props.onHide();
            props.hideCardModal();
            props.rerenderColumn();
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <>
            <Modal show={props.show} className={props.className} onHide={props.onHide} centered>
                <Form onSubmit={deleteCard}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete a Card</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert className={"text-center"} variant={'danger'}>
                            <Alert.Heading>
                                Are you sure you want to delete the Card with name '{props.card.title}'!
                            </Alert.Heading>
                            <p>
                                This action is not reversible!
                            </p>
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'danger'} onClick={deleteCard}>Delete</Button>
                        <Button variant={'secondary'} onClick={props.onHide}>Cancel</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default DeleteCardModal;