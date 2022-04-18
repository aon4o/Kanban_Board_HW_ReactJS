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
            }
            props.onHide();
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <>
            <Modal show={props.show} className={props.className + ' text-dark'} onHide={props.onHide} centered>
                <Form onSubmit={deleteBoard}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Board</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Do you want to delete the board named: ''{props.board.name}''?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'danger'} onClick={deleteBoard}>Yes</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default DeleteBoardModal;