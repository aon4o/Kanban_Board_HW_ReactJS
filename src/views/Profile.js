import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import Title from "../components/Title";
import {useContext, useEffect} from "react";
import authContext from "../utils/authContext";
import {Col, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";


const Profile = () => {

    const auth = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.user) {
            toast.error('Permission denied!');
            navigate('/login');
        }
    }, [auth.user, navigate]);

    const boards = useLiveQuery(
        () => db.boards.where({user_id: auth.user.id}).toArray()
    );

    return (
        <>
            <Title>Profile - {auth.user.username}</Title>

            <Row>
                <Col>
                    {boards?.map((id, name, user_id) => {
                        <p>{name}</p>
                    })}
                </Col>
            </Row>
        </>
    )
}

export default Profile;