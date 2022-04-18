import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {useState} from "react";
import {db} from "../../db";
import {toast} from "react-toastify";
import {CgClose} from "react-icons/cg";


const EditColumnModal = (props) => {

    const oldColumnName = props.column.name;
    const [newColumnName, setNewColumnName] = useState(oldColumnName);

    const rename = async (e) => {
        e.preventDefault();

        try {
            const column = await db.columns.where({name: oldColumnName, board_id: props.column.board_id}).first();
            const newColumn = await db.columns.where({name: newColumnName, board_id: props.board_id}).first();

            if (!column) {
                throw new Error(`Column with name '${props.column.name}' does not exist!`)
            } else if (newColumn) {
                throw new Error(`Column with name '${newColumnName}' already exists!`)
            } else if (newColumnName.length < 3) {
                throw new Error("Column name must be at least 3 symbols!")
            } else if (newColumnName.length > 50) {
                throw new Error("Column name must not be more than 50 symbols!")
            }

            await db.columns.where({name: oldColumnName, board_id: props.column.board_id})
                .modify({name: newColumnName});

            toast.success(`Column '${oldColumnName}' renamed successfully to '${newColumnName}'!`);
            props.onHide();
            props.rerenderBoard();
        } catch (error) {
            console.log(error)
            toast.error(`${error}`);
        }
    }

    return (
        <>
            <Modal show={props.show} className={props.className} onHide={props.onHide} centered>
                <Form onSubmit={rename}>
                    <Modal.Header className={'text-black'} closeButton>
                        <Modal.Title>Rename a Column</Modal.Title>
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
                                value={newColumnName}
                                onChange={e => setNewColumnName(e.target.value)}
                            />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer className={'text-black'}>
                        <Button variant={'dark'} type={'submit'}>Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default EditColumnModal;