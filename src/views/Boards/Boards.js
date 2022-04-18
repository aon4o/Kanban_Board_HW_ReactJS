import {db} from "../../db";
import Title from "../../components/Title";
import {useContext, useEffect, useState} from "react";
import authContext from "../../utils/authContext";
import {Button, Col, Container, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import CreateBoardModal from "../../components/Board/CreateBoardModal";
import Loading from "../../components/Loading";
import BoardsTable from "../../components/Board/BoardsTable";


const Boards = () => {

    const auth = useContext(authContext);
    const navigate = useNavigate();
    const [createBoardModalShow, setCreateBoardModalShow] = useState(false);
    const [boards, setBoards] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [rerender, setRerender] = useState(0);

    useEffect(() => {
        if (!auth.user) {
            toast.error('Permission denied!');
            navigate('/login');
        }
    }, [auth.user, navigate]);

    useEffect(() => {
        db.boards.toArray()
            .then(result => {
                setBoards(result)
            })
            .catch(error => toast.error(error))
            .finally(() => setLoading(false));
    }, [rerender]);

    return (
        <>
            <Container className={'my-5'}>
                <Row>
                    <Col md={6}>
                        <Title>Boards</Title>
                    </Col>
                    <Col md={6}>
                        <div className={'d-flex justify-content-end'}>
                            <Button variant={'outline-light'} onClick={() => setCreateBoardModalShow(true)}>
                                New Board
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Row className={'d-flex justify-content-around gap-4 flex-row flex-wrap'}>
                            {
                                boards !== undefined && boards.length !== 0 && !loading ?
                                    <BoardsTable
                                        className={'col-3'}
                                        boards={boards}
                                        rerender={() => setRerender(rerender + 1)}
                                    />
                                    :
                                    <Loading
                                        loading={loading}
                                        message={"There is no boards."}
                                    />
                            }
                </Row>

                <CreateBoardModal
                    show={createBoardModalShow}
                    onHide={() => setCreateBoardModalShow(false)}
                />
            </Container>
        </>
    )
}

export default Boards;