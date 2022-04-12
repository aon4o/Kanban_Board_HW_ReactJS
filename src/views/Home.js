import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import Title from "../components/Title";
import {Container} from "react-bootstrap";


const Home = () => {

    const users = useLiveQuery(
        () => db.users.toArray()
    );

    return (
        <>
            <Container className={'my-5'}>
                <Title>Home</Title>

                {users?.map(friend => <li key={friend.id}>
                    {friend.username}, {friend.age}
                </li>)}
            </Container>
        </>
    )
}

export default Home;