import {Button, Col, Modal, Row} from "react-bootstrap";
import {db} from "../../db";
import {useLiveQuery} from "dexie-react-hooks";

const CardModal = (props) => {

    const user = useLiveQuery(() =>
        db.users.where({id: props.card.user_id}).first()
    )

    return (
        <>
            <Modal show={props.show} className={props.className} onHide={props.onHide} centered size={'lg'}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.card.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={8}>
                            Description:
                        </Col>
                        <Col md={4}>
                            Actions
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <span>
                        Created by - {user?.username}
                    </span>
                    <Button variant={'secondary'} onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CardModal;