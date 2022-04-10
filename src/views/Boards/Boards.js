import {db} from "../../db";
import {useLiveQuery} from "dexie-react-hooks";
import Title from "../../components/Title";
import {useContext, useEffect, useState} from "react";
import authContext from "../../utils/authContext";
import {Button, Col, Row, Table} from "react-bootstrap";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import CreateBoardModal from "../../components/Board/CreateBoardModal";
import BoardRow from "../../components/Board/BoardRow";


const Boards = () => {

    const auth = useContext(authContext);
    const navigate = useNavigate();
    const [createBoardModalShow, setCreateBoardModalShow] = useState(false);

    useEffect(() => {
        if (!auth.user) {
            toast.error('Permission denied!');
            navigate('/login');
        }
    }, [auth.user, navigate]);

    const boards = useLiveQuery(
        () => db.boards.toArray()
    );

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
                    <Table striped borderless hover variant={'primary'} className={'text-center'}>
                        <thead>
                        <tr>
                            <th>Board</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {boards?.map(board => (
                            <BoardRow key={board.id} board={board}/>
                        ))}
                        </tbody>
                    </Table>
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