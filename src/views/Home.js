import Tittle from '../components/Title'
import todo from '../static/images/todo.png'
import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import Title from "../components/Title";


const Home = () => {

    return (
        <>
            <Container className='welcomePage '>
                <Row>
                    <Col>
                        <h1 className='fw-bolder'>WELCOME TO <Title>UMRELLO!</Title></h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ButtonGroup>
                            <Button variant={'dark'} href={'login'} size={'lg'}>Log In</Button>
                            <Button variant={'primary'} href={'register'} size={'lg'}>Register</Button>
                        </ButtonGroup>
                    </Col>
                    <Col>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <img className='homeImage px-5' src={todo} alt={'to do list'}/>
                        <div className='homeBorder border-bottom'></div>
                    </Col>

                </Row>
            </Container>
        </>
    )
}

export default Home;