import {Alert, Button, Form, Modal} from "react-bootstrap";
import {db} from "../../db";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";


const DeleteBoardModal = (props) => {

    const navigate = useNavigate();

    const deleteBoard = async () => {
        try {
            const columns = await db.columns.where({board_id: props.board.id}).toArray();
            for (const column of columns) {
                await db.cards.where({column_id: column.id}).delete();
            }
            await db.columns.where({board_id: props.board.id}).delete();
            await db.boards.where({id: props.board.id}).delete();

            toast.success(`Board '${props.board.name}' successfully deleted`);
            if (props.redirect) {
                navigate('/boards');
            }
            if (props.rerender) {
                props.rerender();
                props.onHide();
            }
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <>
            <Modal {...props} centered>
                <Form onSubmit={deleteBoard}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete a Board</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert className={"text-center"} variant={'danger'}>
                            <Alert.Heading>
                                Are you sure you want to delete the board with name '{props.board.name}'!
                            </Alert.Heading>
                            This action is not reversible!
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'danger'} onClick={deleteBoard}>Delete</Button>
                        <Button variant={'secondary'} onClick={props.onHide}>Cancel</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default DeleteBoardModal;