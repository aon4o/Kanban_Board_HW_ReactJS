import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {LinkContainer} from 'react-router-bootstrap'
import {useContext, useEffect, useState} from "react";
import authContext from "../../utils/authContext";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import {Button, ButtonGroup, Dropdown} from "react-bootstrap";
import {AiOutlineDown} from "react-icons/ai";
import {GiEvilLove} from "react-icons/gi";
import Container from "react-bootstrap/Container";
import {db} from "../../db";

const NavBar = () => {
    const auth = useContext(authContext);
    const navigate = useNavigate();

    const [recent, setRecent] = useState(undefined);
    const [recentBoards, setRecentBoards] = useState(undefined);
    const [refreshRecentBoards, setRefreshRecentBoards] = useState(0);

    useEffect(() => {
        if (auth.user) {
            db.recent.where({user_id: auth.user.id}).desc().toArray()
                .then((rows) => {
                    const recentArray = [];
                    for (const row of rows) {
                        recentArray.push(row.board_id);
                    }
                    const recentSet = Array.from(new Set(recentArray));
                    setRecent(recentSet);
                })
                .catch(toast.error)
        }
    }, [auth.user, refreshRecentBoards]);

    useEffect(() => {
        if (recent && recent.length !== 0) {
            db.boards.bulkGet(recent.slice(0, 5))
                .then(res => {
                    setRecentBoards(res.filter(item => item !== undefined))
                })
                .catch(toast.error)
        }
    }, [recent]);

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

                                <Dropdown as={ButtonGroup}>
                                    <LinkContainer to="/recent">
                                        <Button className={'linkButtons'}>Recent</Button>
                                    </LinkContainer>

                                    <Dropdown.Toggle
                                        split
                                        className={'linkButtons'}
                                        onFocus={() => setRefreshRecentBoards(refreshRecentBoards + 1)}
                                    />

                                    <Dropdown.Menu>
                                        {
                                            recentBoards?.map(board => (
                                                <LinkContainer to={`/boards/${board.name}`} key={board.id}>
                                                    <Dropdown.Item>{board.name}</Dropdown.Item>
                                                </LinkContainer>
                                            ))
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
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
