import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {useState} from "react";
import {db} from "../../db";
import {toast} from "react-toastify";


const AddLabelModal = (props) => {

    const [title, setTitle] = useState('');
    const [color, setColor] = useState('#e02f8a');

    const createLabel = async (e) => {
        e.preventDefault();

        try {
            const label = await db.labels.where({title: title, board_id: props.card.board_id}).first();

            if (label) {
                throw new Error("Duplicate Label titles for the current Board!")
            } else if (title.length < 3) {
                throw new Error("Label title must be at least 3 symbols!")
            } else if (title.length > 30) {
                throw new Error("Label title must not be more than 30 symbols!")
            }

            const newLabelId = await db.labels.add({
                title: title,
                color: color,
                board_id: props.card.board_id
            });

            const newLabel = await db.labels.where({id: newLabelId}).first();

            await db.card_labels.add({
                card_id: props.card.id,
                label_id: newLabel.id,
            });

            toast.success(`Label '${title}' added successfully!`);
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
                <Form onSubmit={createLabel}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a Label</Modal.Title>
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
                        <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
                        <Form.Control
                            type="color"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                            title="Choose your color"
                        />
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

export default AddLabelModal;