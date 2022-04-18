import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {useState} from "react";
import {db} from "../../db";
import {toast} from "react-toastify";
import {CgClose} from "react-icons/cg";


const EditCardModal = (props) => {

    const [title, setTitle] = useState(props.card.title);
    const [description, setDescription] = useState(props.card.description);

    const editCard = async (e) => {
        e.preventDefault();

        try {
            const card = await db.cards.where({title: title, board_id: props.card.board_id}).first();

            if (card && card.id !== props.card.id) {
                throw new Error("Duplicate Card names for the current Board!")
            } else if (title.length < 3) {
                throw new Error("Card title must be at least 3 symbols!")
            } else if (title.length > 50) {
                throw new Error("Card title must not be more than 50 symbols!")
            } else if (description.length < 3) {
                throw new Error("Card description must be at least 3 symbols!")
            }

            await db.cards.where({id: props.card.id}).modify({
                title: title,
                description: description,
            });

            toast.success(`Card '${title}' edited successfully!`);
            props.rerenderColumn();
            props.onHide();
        } catch (error) {
            console.log(error)
            toast.error(`${error}`);
        }
    }

    return (
        <>
            <Modal show={props.show} className={props.className} onHide={props.onHide} centered>
                <Form onSubmit={editCard}>
                    <Modal.Header className={'text-black'} closeButton>
                        <Modal.Title>Edit a Card</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={'text-black'}>
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
                    <Modal.Footer className={'text-black'}>
                        <Button variant={'dark'} type={'submit'}>Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default EditCardModal;