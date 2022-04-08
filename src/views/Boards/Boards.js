import {db} from "../../db";
import {useLiveQuery} from "dexie-react-hooks";
import Title from "../../components/Title";
import {useContext, useEffect, useState} from "react";
import authContext from "../../utils/authContext";
import {Button, Col, Row, Table} from "react-bootstrap";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import CreateBoardModal from "../../components/CreateBoardModal";
import {LinkContainer} from "react-router-bootstrap";
import {FaEdit, FaExternalLinkAlt, FaTrash} from "react-icons/fa";


const Boards = () => {

    const auth = useContext(authContext);
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);

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
                        <Button variant={'outline-primary'} onClick={() => setModalShow(true)}>
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
                            <tr key={board.id}>
                                <td>
                                    {board.name}
                                </td>
                                <td className={'d-flex justify-content-evenly'}>
                                    <LinkContainer to={`${board.name}`}>
                                        <Button variant={"success"}><FaExternalLinkAlt/></Button>
                                    </LinkContainer>
                                    <LinkContainer to={`#`}>
                                        <Button disabled variant={"warning"}><FaEdit/></Button>
                                    </LinkContainer>
                                    <LinkContainer to={`#`}>
                                        <Button disabled variant={"danger"}><FaTrash/></Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <CreateBoardModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    )
}

export default Boards;