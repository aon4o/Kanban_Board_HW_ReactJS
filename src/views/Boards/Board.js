import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import {Button, Col, Container, Row, Stack} from "react-bootstrap";
import {toast} from "react-toastify";
import {db} from "../../db";
import authContext from "../../utils/authContext";
import Title from "../../components/Title";
import AddColumnModal from "../../components/Column/AddColumnModal";
import ColumnCard from "../../components/Column/ColumnCard";
import Loading from "../../components/Loading";
import ArchivedCardsModal from "../../components/ArchivedCardsModal";
import {AiOutlinePlus} from "react-icons/ai";


const Board = () => {
    const {name} = useParams();
    const auth = useContext(authContext);
    const navigate = useNavigate();

    const [board, setBoard] = useState(undefined);
    const [columns, setColumns] = useState(undefined);
    const [labels, setLabels] = useState(undefined);
    const [loadingColumns, setLoadingColumns] = useState(true);
    const [addColumnModalShow, setAddColumnModalShow] = useState(false);
    const [archivedCardsModalShow, setArchivedCardsModalShow] = useState(false);
    const [rerenderColumns, setRerenderColumns] = useState(0);
    const [rerenderLabels, setRerenderLabels] = useState(0);

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
    }, [name, rerenderColumns]);

    useEffect(() => {
        db.labels.where({board_id: board?.id}).toArray()
            .then(setLabels)
            .catch(toast.error);
    }, [board, rerenderLabels]);

    const getRecentBoards = async () => {
        await db.recent
            .where({user_id: auth.user.id, board_id: board.id})
            .delete()

        const userRecent = await db.recent
            .where({user_id: auth.user.id})
            .toArray()

        if (userRecent.length === 5) {
            await db.recent.where({id: userRecent[0].id}).delete();
        }

        await db.recent.add({
            user_id: auth.user.id,
            board_id: board.id
        })
    }

    useEffect(() => {
        if (board !== undefined && auth.user) {
            getRecentBoards();
        }
    }, [auth.user, board, getRecentBoards])

    useEffect(() => {
        setLoadingColumns(true);
        db.columns.where({board_id: board?.id}).sortBy('position')
            .then(setColumns)
            .catch(toast.error)
            .finally(() => setLoadingColumns(false));
    }, [board, rerenderColumns])

    return (
        <>
            <Container className={'visually-hidden'}>
                <Row>
                    <Col>
                        <Title>{name}</Title>
                    </Col>
                </Row>
            </Container>

            {
                columns !== undefined && columns.length !== 0 && !loadingColumns ?
                    <Container fluid className={'px-4 d-flex align-items-stretch mt-3'}>
                        <Row className={'flex-nowrap gap-3 scrollable-board flex-grow-1'}>
                            {
                                columns?.map(column => (
                                    <ColumnCard key={column.id}
                                                column={column}
                                                labels={labels}
                                                rerenderBoard={() => setRerenderColumns(rerenderColumns + 1)}
                                                rerenderLabels={() => setRerenderLabels(rerenderLabels + 1)}
                                    />
                                ))
                            }
                            <Stack gap={3}>
                                <Button
                                    className={'boardButton'}
                                    variant={'outline-light'}
                                    onClick={() => setAddColumnModalShow(true)}
                                ><AiOutlinePlus/> Add Column</Button>
                                <Button
                                    className={'boardButton'}
                                    variant={'outline-light'}
                                    onClick={() => setArchivedCardsModalShow(true)}
                                >Archived Cards</Button>
                            </Stack>
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
                rerenderBoard={() => setRerenderColumns(rerenderColumns + 1)}
            />

            {
                board?.id &&
                <ArchivedCardsModal
                    show={archivedCardsModalShow}
                    onHide={() => setArchivedCardsModalShow(false)}
                    board_id={board?.id}
                    rerenderBoard={() => setRerenderColumns(rerenderColumns + 1)}
                />
            }

        </>
    )
}

export default Board;