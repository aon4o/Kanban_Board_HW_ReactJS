import {db} from "../db";
import Title from "../components/Title";
import {useContext, useEffect, useState} from "react";
import authContext from "../utils/authContext";
import {Col, Container, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import BoardsTable from "../components/Board/BoardsTable";
import Loading from "../components/Loading";
import CardCard from "../components/Card/CardCard";

const Profile = () => {

    const auth = useContext(authContext);
    const navigate = useNavigate();

    const [boards, setBoards] = useState(undefined);
    const [loadingBoards, setLoadingBoards] = useState(true);
    const [rerenderBoards, setRerenderBoards] = useState(0);

    const [cards, setCards] = useState(undefined);
    const [loadingCards, setLoadingCards] = useState(true);
    const [rerenderCards, setRerenderCards] = useState(0);

    useEffect(() => {
        if (!auth.user) {
            toast.error('Permission denied!');
            navigate('/login');
        }
    }, [auth.user, navigate]);

    useEffect(() => {
        db.boards.where({user_id: auth.user.id}).toArray()
            .then(result => {
                setBoards(result)
            })
            .catch(error => toast.error(error))
            .finally(() => setLoadingBoards(false));
    }, [auth.user, rerenderBoards]);

    useEffect(() => {
        db.cards.where({assignee_id: auth.user.id}).toArray()
            .then(setCards)
            .catch(toast.error)
            .finally(() => setLoadingCards(false));
    }, [auth.user, rerenderCards]);

    return (
        <>
            <Container className={'my-5'}>
                <div className={'visually-hidden'}>
                    <Title>Profile</Title>
                </div>
                <Row className={'d-flex justify-content-center'}>
                    <Col className={'col-4'}>
                        <h3 className={'text-center mb-4'}>My Boards</h3>
                        {
                            boards !== undefined && boards.length !== 0 && !loadingBoards ?
                                <BoardsTable
                                    boards={boards}
                                    rerender={() => setRerenderBoards(rerenderBoards + 1)}
                                />
                                :
                                <Loading
                                    loading={loadingBoards}
                                    message={"You have no Boards created."}
                                />
                        }
                    </Col>
                    <Col className={'px-3 col-5'}>
                        <h3 className={'text-center mb-4'}>Tasks</h3>
                        {
                            cards !== undefined && cards.length !== 0 && !loadingCards ?
                                cards.map(card => (
                                    <CardCard
                                        className={'text-black my-2'}
                                        key={card.id}
                                        card={card}
                                        rerender={() => setRerenderCards(rerenderCards + 1)}
                                    />
                                ))
                                :
                                <Loading
                                    loading={loadingCards}
                                    message={"You don't have tasks that aren't done. Yey :)"}
                                />
                        }
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Profile;