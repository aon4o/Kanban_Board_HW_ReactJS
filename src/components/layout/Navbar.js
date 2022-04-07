import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {LinkContainer} from 'react-router-bootstrap'
import {useContext} from "react";
import authContext from "../../utils/authContext";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";

const NavBar = () => {
    const auth = useContext(authContext);
    const navigate = useNavigate();

    const logout = () => {
        auth.setUsername('');
        toast.success("You logged out successfully!");
        navigate('/');
    }

    return (
        <>
            <Navbar id={'navbar'} expand="lg" variant={"dark"}>
                <Container id={'navbar-container'} className={'bg-primary shadow-lg-mine mt-3 px-3 py-2 rounded-3 border-3 border-primary'}>
                    <LinkContainer to="/">
                        <Navbar.Brand>Kanban Board</Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav" className={"d-flex justify-content-end"}>
                        <Nav className="align-self-end">

                            {auth.username ?
                                <>
                                    <LinkContainer to="/classes">
                                        <Nav.Link>Класове</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/subjects">
                                        <Nav.Link>Предмети</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/users">
                                        <Nav.Link>Потребители</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/discord" className={'ms-5'}>
                                        <Nav.Link>Discord Bot</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/instructions">
                                        <Nav.Link>Инструкции</Nav.Link>
                                    </LinkContainer>
                                </>
                                :
                                <></>
                            }

                            {auth.username ?
                                <>
                                    <LinkContainer to="/users/me" className={'ms-5'}>
                                        <Nav.Link>Profile</Nav.Link>
                                    </LinkContainer>
                                    <Nav.Link onClick={logout}>Log Out</Nav.Link>
                                </>
                                :
                                <>
                                    <LinkContainer to="/login" className={'ms-5'}>
                                        <Nav.Link>Log In</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/register">
                                        <Nav.Link>Register</Nav.Link>
                                    </LinkContainer>
                                </>
                            }

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
};

export default NavBar;
