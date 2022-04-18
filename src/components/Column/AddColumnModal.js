import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {useState} from "react";
import {db} from "../../db";
import {toast} from "react-toastify";


const AddColumnModal = (props) => {

    const [columnName, setColumnName] = useState('');

    const createBoard = async (e) => {
        e.preventDefault();

        try {
            const column = await db.columns.where({name: columnName, board_id: props.board_id}).first();

            if (column) {
                throw new Error("Duplicate Column names!")
            } else if (columnName.length < 3) {
                throw new Error("Column name must be at least 3 symbols!")
            } else if (columnName.length > 50) {
                throw new Error("Column name must not be more than 50 symbols!")
            }

            const columnsCount = (await db.columns.where({board_id: props.board_id}).toArray()).length;

            await db.columns.add({
                name: columnName,
                position: columnsCount + 1,
                board_id: props.board_id,
            });

            toast.success(`Column '${columnName}' added successfully!`);
            props.rerenderBoard();
        } catch (error) {
            console.log(error)
            toast.error(`${error}`);
        }
    }

    return (
        <>
            <Modal show={props.show} className={props.className} onHide={props.onHide} centered>
                <Form onSubmit={createBoard}>
                    <Modal.Header closeButton className={'text-black'}>
                        <Modal.Title>Add Column</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={'text-black'}>
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
                    <Modal.Footer className={'text-black'}>
                        <Button variant={'dark'} type={'submit'}>Add</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default AddColumnModal;