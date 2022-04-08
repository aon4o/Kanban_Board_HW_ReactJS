import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {useContext, useState} from "react";
import {db} from "../db";
import {toast} from "react-toastify";
import authContext from "../utils/authContext";
import {useNavigate} from "react-router";


const CreateBoardModal = (props) => {

    const [columnName, setColumnName] = useState('');

    const createBoard = async (e) => {
        e.preventDefault();

        try {
            const column = await db.columns.where({name: columnName, board_id: props.board_id}).first();

            if (column) {
                throw new Error("Duplicate Column names!")
            }

            await db.columns.add({
                name: columnName,
                board_id: props.board_id,
            });

            toast.success(`Column '${columnName}' added successfully!`);
        } catch (error) {
            console.log(error)
            toast.error(`${error}`);
        }
    }

    return (
        <>
            <Modal {...props} centered>
                <Form onSubmit={createBoard}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a Column</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Column Name"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="column name"
                                autoFocus
                                value={columnName}
                                onChange={e => setColumnName(e.target.value)}
                            />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'primary'} type={'submit'}>Add</Button>
                        <Button variant={'secondary'} onClick={props.onHide}>Cancel</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default CreateBoardModal;