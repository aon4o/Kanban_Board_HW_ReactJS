import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {LinkContainer} from 'react-router-bootstrap'
import {useContext} from "react";
import authContext from "../../utils/authContext";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import {Button} from "react-bootstrap";
import {AiOutlineDown} from "react-icons/ai";
import {GiEvilLove} from "react-icons/gi";
import Container from "react-bootstrap/Container";

const NavBar = () => {
    const auth = useContext(authContext);
    const navigate = useNavigate();

    const logout = () => {
        auth.setUser(undefined);
        toast.success("You logged out successfully!");
        navigate('/');
    }

    return (
        <>
            <Navbar id={'navbar'} variant={'dark'} className={'fw-bolder'}>
                <LinkContainer to="/">
                    <Button className={'linkButtons fw-bolder'}><GiEvilLove fontSize={'24'} className={'me-1'}/>Umrello</Button>
                </LinkContainer>

                <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                <Navbar.Collapse id="basic-navbar-nav" className={"d-flex"}>
                    <Nav>

                        {auth.user ?
                            <>
                                <LinkContainer to="/boards">
                                    <Button className={'linkButtons'}>Boards<AiOutlineDown fontSize={'15'}
                                                                                           className={'ms-1'}/></Button>
                                </LinkContainer>
                                <LinkContainer to="/recent">
                                    <Button className={'linkButtons'}>Recent<AiOutlineDown fontSize={'15'}
                                                                                           className={'ms-1'}/></Button>
                                </LinkContainer>
                            </>
                            :
                            <></>
                        }

                        {auth.user ?
                            <>
                                <LinkContainer to="/profile">
                                    <Button className={'linkButtons'}>Profile</Button>
                                </LinkContainer>
                                <Button className='linkButtons' onClick={logout}>Logout</Button>
                            </>
                            :
                            <>
                                <Container className={'d-flex justify-items-end'}>
                                    <LinkContainer to="/login">
                                        <Button className={'linkButtons'}>Log In</Button>
                                    </LinkContainer>
                                    <LinkContainer to="/register">
                                        <Button className={'linkButtons'}>Register</Button>
                                    </LinkContainer>
                                </Container>
                            </>
                        }

                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
};

export default NavBar;
