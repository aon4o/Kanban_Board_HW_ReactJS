import {Col, Modal, Row} from "react-bootstrap";
import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import {useState} from "react";
import CardCard from "./Card/CardCard";

const ArchivedCardsModal = (props) => {

    const [rerenderArchive, setRerenderArchive] = useState(0);

    const cards = useLiveQuery(() =>
        db.cards.where({board_id: props.board_id, column_id: 'archived'}).toArray()
    )

    return (
        <>
            <Modal fullscreen show={props.show} className={props.className + ' text-black'} onHide={props.onHide} centered size={'lg'}>
                <Modal.Header closeButton>
                    <Modal.Title>Archived Cards</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={4}>
                        {
                            cards?.map(card => (
                                <Row key={card.id}>
                                    <CardCard
                                        card={card}
                                        className={'m-2'}
                                        archived
                                        rerenderArchive={() => setRerenderArchive(rerenderArchive + 1)}
                                        rerenderBoard={props.rerenderBoard}
                                    />
                                </Row>
                            ))
                        }
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ArchivedCardsModal;