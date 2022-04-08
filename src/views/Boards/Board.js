import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import {Button, Card, CardGroup, Col, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import {db} from "../../db";
import authContext from "../../utils/authContext";
import Title from "../../components/Title";
import AddColumnModal from "../../components/AddColumnModal";


const Board = () => {
    const {name} = useParams();
    const auth = useContext(authContext);
    const navigate = useNavigate();

    const [board, setBoard] = useState();
    const [columns, setColumns] = useState();
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        if (!auth.user) {
            toast.error('Permission denied!');
            navigate('/login');
        }
    }, [auth.user, navigate]);

    useEffect(() => {
        db.boards.where({name: name}).first()
            .then(setBoard);
    }, [name])

    useEffect(() => {
        db.columns.where({board_id: board?.id}).toArray()
            .then(setColumns);
    }, [board])

    // await db.columns.where({board_id: cards.id}).toArray()

    return (
        <>
            <Row>
                <Col md={6}>
                    <Title>Board - {name}</Title>
                </Col>

                <Col md={6}>
                    <div className={'d-flex justify-content-end'}>
                        <Button variant={'outline-primary'} onClick={() => setModalShow(true)}>Add Column</Button>
                    </div>
                </Col>

                <Col>
                    <CardGroup>
                        {
                            columns?.map(column => (
                                <Card>
                                    <Card.Header>
                                        {column.name}
                                    </Card.Header>
                                    <Card.Body>
                                        <div>
                                            TODO
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))
                        }
                    </CardGroup>
                </Col>

            </Row>

            <AddColumnModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                board_id={board?.id}
            />
        </>
    )
}

export default Board;