import {db} from "../db";
import {useState} from "react";
import Title from "../components/Title";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import {Button, Col, FloatingLabel, Form, Row} from "react-bootstrap";
const hash = require("sha1");

const Home = () => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const register = async (e) => {
        e.preventDefault();
        try {
            const user = await db.users.where({username: name}).first();

            if (user) {
                throw new Error("Duplicate usernames!")
            }

            await db.users.add({
                username: name,
                password: hash(password),
            });

            toast.success(`Successfully registered as ${name}!`);
            navigate('/login');
        } catch (error) {
            console.log(error)
            toast.error(`Failed register user ${name}: ${error}`);
        }
    }

    return (
        <Row>
            <Col>

                <Title>Register</Title>

                <Form onSubmit={register}>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Username"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            placeholder="username"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </FloatingLabel>

                    <FloatingLabel
                        controlId="floatingPassword"
                        label="Password"
                        className="mb-3"
                    >
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </FloatingLabel>

                    <Button type={'submit'} className="mb-3">
                        Register
                    </Button>
                </Form>

            </Col>
        </Row>
    )
}

export default Home;