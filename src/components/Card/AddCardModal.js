import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {useContext, useState} from "react";
import {db} from "../../db";
import {toast} from "react-toastify";
import authContext from "../../utils/authContext";


const AddCardModal = (props) => {

    const auth = useContext(authContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const createBoard = async (e) => {
        e.preventDefault();

        try {
            const card = await db.cards.where({title: title, board_id: props.column.board_id}).first();

            if (card) {
                throw new Error("Duplicate Card names for the current Board!")
            } else if (title.length < 3) {
                throw new Error("Card title must be at least 3 symbols!")
            } else if (title.length > 50) {
                throw new Error("Card title must not be more than 50 symbols!")
            } else if (description.length < 3) {
                throw new Error("Card description must be at least 3 symbols!")
            }

            await db.cards.add({
                title: title,
                description: description,
                user_id: auth.user.id,
                column_id: props.column.id,
                board_id: props.column.board_id
            });

            toast.success(`Card '${title}' added successfully!`);
            props.rerender();
            props.onHide();
        } catch (error) {
            console.log(error)
            toast.error(`${error}`);
        }
    }

    return (
        <>
            <Modal show={props.show} className={props.className} onHide={props.onHide} centered>
                <Form onSubmit={createBoard}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a Card</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="titleInput"
                            label="Title"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Title"
                                autoFocus
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="descriptionInput" label="Description">
                            <Form.Control
                                as="textarea"
                                placeholder="Description"
                                style={{ height: '100px' }}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
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

export default AddCardModal;