import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import Title from "../components/Title";


const Home = () => {

    const users = useLiveQuery(
        () => db.users.toArray()
    );

    return (
        <>
            <Title>Home</Title>

            {users?.map(friend => <li key={friend.id}>
                {friend.username}, {friend.age}
            </li>)}
        </>
    )
}

export default Home;