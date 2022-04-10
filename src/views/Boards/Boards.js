import {db} from "../../db";
import Title from "../../components/Title";
import {useContext, useEffect, useState} from "react";
import authContext from "../../utils/authContext";
import {Button, Col, Row, Table} from "react-bootstrap";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import CreateBoardModal from "../../components/Board/CreateBoardModal";
import BoardRow from "../../components/Board/BoardRow";
import Loading from "../../components/Loading";


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
            .then(result => {setBoards(result)})
            .catch(error => toast.error(error))
            .finally(() => setLoading(false));
    }, [rerender]);

    return (
        <>
            <Row>
                <Col md={6}>
                    <Title>Boards</Title>
                </Col>
                <Col md={6}>
                    <div className={'d-flex justify-content-end'}>
                        <Button variant={'outline-primary'} onClick={() => setCreateBoardModalShow(true)}>
                            New Board
                        </Button>
                    </div>
                </Col>
                <Col>
                    {
                        boards !== undefined && boards.length !== 0 && !loading ?
                            <Table striped borderless hover variant={'primary'} className={'text-center'}>
                                <thead>
                                <tr>
                                    <th>Board</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {boards?.map(board => (
                                    <BoardRow
                                        key={board.id}
                                        board={board}
                                        rerender={() => setRerender(rerender + 1)}
                                    />
                                ))}
                                </tbody>
                            </Table>
                            :
                            <Loading
                                loading={loading}
                                message={""}
                            />
                    }

                </Col>
            </Row>

            <CreateBoardModal
                show={createBoardModalShow}
                onHide={() => setCreateBoardModalShow(false)}
            />
        </>
    )
}

export default Boards;