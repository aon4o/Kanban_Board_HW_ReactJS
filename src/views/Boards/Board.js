import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import {Button, CardGroup, Col, Row} from "react-bootstrap";
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
            <Row>
                <Col md={6}>
                    <Title>Board - {name}</Title>
                </Col>

                <Col md={6}>
                    <div className={'d-flex justify-content-end'}>
                        <Button variant={'outline-primary'} onClick={() => setModalShow(true)}>Add Column</Button>
                    </div>
                </Col>

                <CardGroup>
                    {
                        columns?.map(column => (
                            <Col key={column.index}>
                                <ColumnCard
                                    column={column}
                                    rerenderer={rerenderColumns}
                                    rerender={setRerenderColumns}
                                />
                            </Col>
                        ))
                    }
                </CardGroup>

            </Row>

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