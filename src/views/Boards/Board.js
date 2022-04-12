import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import {Button, Col, Container, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import {db} from "../../db";
import authContext from "../../utils/authContext";
import Title from "../../components/Title";
import AddColumnModal from "../../components/Column/AddColumnModal";
import ColumnCard from "../../components/Column/ColumnCard";


const Board = () => {
    const {name} = useParams();
    const auth = useContext(authContext);
    const navigate = useNavigate();

    const [board, setBoard] = useState();
    const [columns, setColumns] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [rerenderColumns, setRerenderColumns] = useState(0);

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
        db.columns.where({board_id: board?.id}).sortBy('position')
            .then(setColumns);
    }, [board, rerenderColumns])

    // await db.columns.where({board_id: cards.id}).toArray()

    return (
        <>
            <Container className={'mt-5'}>
                <Row>
                    <Col md={6}>
                        <Title>Board - {name}</Title>
                    </Col>

                    <Col md={6}>
                        <div className={'d-flex justify-content-end'}>
                            <Button variant={'outline-primary'} onClick={() => setModalShow(true)}>Add Column</Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container fluid className={'px-4 d-flex align-items-stretch'}>
                <Row className={'flex-nowrap gap-3 scrollable-board flex-grow-1'}>
                    {
                        columns?.map(column => (
                            <ColumnCard key={column.index}
                                        column={column}
                                        rerender={() => setRerenderColumns(rerenderColumns + 1)}
                            />
                        ))
                    }
                </Row>
            </Container>

            <AddColumnModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                board_id={board?.id}
                rerender={() => setRerenderColumns(rerenderColumns + 1)}
            />
        </>
    )
}

export default Board;