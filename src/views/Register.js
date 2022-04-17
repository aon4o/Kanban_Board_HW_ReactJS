import {db} from "../db";
import {useState} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import {Button, Col, Container, FloatingLabel, Form, Row} from "react-bootstrap";
import Title from "../components/Title";
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
        <Container className={'my-5'}>
            <Row className={'text-center justify-content-center'}>
                <Col>
                    <Title>JOIN US</Title>
                </Col>
            </Row>
            <Row className={'justify-content-center text-center'}>
                <Col className={'col-sm-3'}>
                    <Form onSubmit={register}>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Username"
                            className="mb-3 text-white"
                        >
                            <Form.Control
                                className={'bg-transparent text-white border-2 rounded-mine shadow-mine inputText'}
                                type="text"
                                placeholder="username"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="floatingPassword"
                            label="Password"
                            className="mb-3 text-white"
                        >
                            <Form.Control
                                className={'bg-transparent text-white border-2 rounded-mine shadow-mine inputText'}
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </FloatingLabel>

                        <Button type={'submit'} variant={"primary"}>
                            Register
                        </Button>
                    </Form>

                </Col>
            </Row>
        </Container>
    )
}

export default Home;