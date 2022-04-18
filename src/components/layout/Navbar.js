import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {LinkContainer} from 'react-router-bootstrap'
import {useContext, useEffect, useState} from "react";
import authContext from "../../utils/authContext";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import {Alert, Button, Dropdown} from "react-bootstrap";
import {GiEvilLove} from "react-icons/gi";
import {db} from "../../db";
import {FiChevronDown} from "react-icons/fi";

const NavBar = () => {
    const auth = useContext(authContext);
    const navigate = useNavigate();

    const [recent, setRecent] = useState(undefined);
    const [recentBoards, setRecentBoards] = useState(undefined);
    const [refreshRecentBoards, setRefreshRecentBoards] = useState(0);

    useEffect(() => {
        if (auth.user) {
            db.recent.where({user_id: auth.user.id}).reverse().sortBy('id')
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
            <Navbar id={'navbar'} variant={'dark'} className={'fw-bolder'} sticky={'top'}>
                {auth.user ?
                    <>
                        <LinkContainer to="/profile">
                            <Button className={'linkButtons fw-bolder'}><GiEvilLove fontSize={'25'} className={'me-1 mb-1'}/><text className={'homebutton'}>Umrello</text></Button>
                        </LinkContainer>
                    </>
                    :
                    <>
                        <LinkContainer to="/">
                            <Button className={'linkButtons fw-bolder'}><GiEvilLove fontSize={'25'} className={'me-1 mb-1'}/><text className={'homebutton'}>Umrello</text></Button>
                        </LinkContainer>
                    </>
                }


                <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                <Navbar.Collapse id="basic-navbar-nav" className={"d-flex"}>
                    <Nav>

                        {auth.user ?
                            <>
                                <LinkContainer to="/boards">
                                    <Button className={'linkButtons'}>Boards</Button>
                                </LinkContainer>

                                <Dropdown>
                                    <Dropdown.Toggle
                                        split
                                        className={'linkButtons'}
                                        onFocus={() => setRefreshRecentBoards(refreshRecentBoards + 1)}
                                    >Recent  <FiChevronDown size={20} className={'pb-1'}/></Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {
                                            recentBoards ?
                                                recentBoards.map(board => (
                                                    <LinkContainer to={`/boards/${board.name}`} key={board.id}>
                                                        <Dropdown.Item>{board.name}</Dropdown.Item>
                                                    </LinkContainer>
                                                ))
                                                :
                                                <Alert variant={'warning'}>
                                                    You don't have recent Boards yet!
                                                </Alert>
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                            :
                            <></>
                        }

                        {auth.user ?
                            <>
                                <Button className='linkButtons mb-1' onClick={logout}>Logout</Button>
                            </>
                            :
                            <>
                            </>
                        }

                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
};

export default NavBar;
