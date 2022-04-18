import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {useContext, useState} from "react";
import {db} from "../../db";
import {toast} from "react-toastify";
import authContext from "../../utils/authContext";
import {useNavigate} from "react-router";


const CreateBoardModal = (props) => {

    const auth = useContext(authContext);
    const navigate = useNavigate();

    const [boardName, setBoardName] = useState('');

    const createBoard = async (e) => {
        e.preventDefault();

        try {
            const board = await db.boards.where({name: boardName}).first();

            if (board) {
                throw new Error("Duplicate Board names!");
            } else if (boardName.length < 3) {
                throw new Error("Board name must be at least 3 symbols!");
            } else if (boardName.length > 50) {
                throw new Error("Board name must not be more than 50 symbols!");
            }

            const newBoard = await db.boards.add({
                name: boardName,
                user_id: auth.user.id,
            });

            let columnsCount = 1;
            for (const columnName of ['To Do', 'In Progress', 'Waiting Review', 'Done']) {
                await db.columns.add({
                    name: columnName,
                    position: columnsCount,
                    board_id: newBoard,
                });
                columnsCount++;
            }

            toast.success(`Board '${boardName}' successfully created!`);
            navigate(`/boards/${boardName}`);
        } catch (error) {
            console.log(error)
            toast.error(`${error}`);
        }
    }

    return (
        <>
            <Modal show={props.show} className={props.className + ' text-dark'} onHide={props.onHide} centered>
                <Form onSubmit={createBoard}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Board</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Board Name"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Board Name"
                                autoFocus
                                value={boardName}
                                onChange={e => setBoardName(e.target.value)}
                            />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'dark'} type={'submit'}>Create</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default CreateBoardModal;