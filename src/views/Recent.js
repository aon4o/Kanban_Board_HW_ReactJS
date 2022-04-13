import {useContext, useEffect, useState} from "react";
import {Col, Container, FormControl, InputGroup, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import authContext from "../utils/authContext";
import Title from "../components/Title";
import {db} from "../db";
import BoardsTable from "../components/Board/BoardsTable";
import Loading from "../components/Loading";


const Recent = () => {

    const auth = useContext(authContext);
    const navigate = useNavigate();
    const [recent, setRecent] = useState(undefined);
    const [boards, setBoards] = useState(undefined);
    const [loadingBoards, setLoadingBoards] = useState(true);
    const [showNumber, setShowNumber] = useState(10);
    const [rerender, setRerender] = useState(0);

    useEffect(() => {
        if (!auth.user) {
            toast.error('Permission denied!');
            navigate('/login');
        }
    }, [auth.user, navigate]);

    useEffect(() => {
        if (auth.user) {
            db.recent.where({user_id: auth.user.id}).desc().toArray()
                .then((rows) => {
                    const recentArray = [];
                    for (const row of rows) {
                        recentArray.push(row.board_id);
                    }
                    const recentSet = Array.from(new Set(recentArray));
                    setRecent(recentSet);
                })
                .catch(toast.error)
        }
    }, [auth.user]);

    useEffect(() => {
        if (recent && recent.length !== 0) {
            db.boards.bulkGet(recent.slice(0, showNumber))
                .then(setBoards)
                .catch(toast.error)
                .finally(() => setLoadingBoards(false));
        }
    }, [recent, showNumber])

    return (
        <>
            <Container className={'my-5'}>
                <Row>
                    <Col md={6}>
                        <Title>Recently used Boards</Title>
                    </Col>
                    <Col md={6}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Show Boards</InputGroup.Text>
                            <FormControl
                                type={'number'}
                                min={5}
                                max={30}
                                step={5}
                                value={showNumber}
                                onChange={e => setShowNumber(e.target.value)}
                            />
                        </InputGroup>
                    </Col>

                    <Col>
                        {
                            boards !== undefined && boards.length !== 0 && !loadingBoards ?
                                <BoardsTable
                                    boards={boards}
                                    rerender={() => setRerender(rerender + 1)}
                                />
                                :
                                <Loading
                                    loading={loadingBoards}
                                    message={"You haven't used any Boards recently."}
                                />
                        }
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Recent;