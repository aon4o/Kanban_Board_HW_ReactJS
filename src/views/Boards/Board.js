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
import Loading from "../../components/Loading";
import ArchivedCardsModal from "../../components/ArchivedCardsModal";


const Board = () => {
    const {name} = useParams();
    const auth = useContext(authContext);
    const navigate = useNavigate();

    const [board, setBoard] = useState(undefined);
    const [columns, setColumns] = useState(undefined);
    const [loadingColumns, setLoadingColumns] = useState(true);
    const [addColumnModalShow, setAddColumnModalShow] = useState(false);
    const [archivedCardsModalShow, setArchivedCardsModalShow] = useState(false);
    const [rerenderColumns, setRerenderColumns] = useState(0);

    useEffect(() => {
        if (!auth.user) {
            toast.error('Permission denied!');
            navigate('/login');
        }
    }, [auth.user, navigate]);

    useEffect(() => {
        db.boards.where({name: name}).first()
            .then(setBoard)
            .catch(toast.error);
    }, [name, rerenderColumns])

    useEffect(() => {
        if (board !== undefined && auth.user) {
            db.recent.add({
                user_id: auth.user.id,
                board_id: board.id
            })
        }
    }, [auth.user, board])

    useEffect(() => {
        setLoadingColumns(true);
        db.columns.where({board_id: board?.id}).sortBy('position')
            .then(setColumns)
            .catch(toast.error)
            .finally(() => setLoadingColumns(false));
    }, [board, rerenderColumns])

    return (
        <>
            <Container className={'mt-5'}>
                <Row>
                    <Col md={6}>
                        <Title>Board - {name}</Title>
                    </Col>

                    <Col md={6}>
                        <div className={'d-flex justify-content-end'}>
                            <Button
                                className={'boardButton'}
                                variant={'outline-light'}
                                onClick={() => setArchivedCardsModalShow(true)}
                            >Archived Cards</Button>
                        </div>
                        <div className={'d-flex justify-content-end'}>
                            <Button
                                className={'boardButton'}
                                variant={'outline-light'}
                                onClick={() => setAddColumnModalShow(true)}
                            >Add Column</Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            {
                columns !== undefined && columns.length !== 0 && !loadingColumns ?
                    <Container fluid className={'px-4 d-flex align-items-stretch'}>
                        <Row className={'flex-nowrap gap-3 scrollable-board flex-grow-1 columns'}>
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
                    :
                    <Container>
                        <Loading
                            loading={loadingColumns}
                            message={"The Board doesn't have any Columns."}
                        />
                    </Container>
            }

            <AddColumnModal
                show={addColumnModalShow}
                onHide={() => setAddColumnModalShow(false)}
                board_id={board?.id}
                rerender={() => setRerenderColumns(rerenderColumns + 1)}
            />

            {
                board?.id &&
                <ArchivedCardsModal
                    show={archivedCardsModalShow}
                    onHide={() => setArchivedCardsModalShow(false)}
                    board_id={board?.id}
                    rerender={() => setRerenderColumns(rerenderColumns + 1)}
                />
            }

        </>
    )
}

export default Board;