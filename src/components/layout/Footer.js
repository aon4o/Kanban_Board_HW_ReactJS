import Container from "react-bootstrap/Container";
import {FaGithub, FaCode, FaHeart, FaCoffee, FaGlobe, FaInstagram, FaLinkedin} from "react-icons/fa";

const Footer = () => {
    return (
        <footer>
            <Container className="d-flex flex-wrap justify-content-between align-items-center py-3">
                <div className="col-md-4 d-flex align-items-center">
                    <a className="mb-3 me-3 mb-md-0 lh-1 text-primary" href={"https://github.com/aon2003/Kanban_Board_HW_ReactJS"}>
                        <FaGithub/>
                    </a>
                    <a className="mb-3 me-3 mb-md-0 lh-1 text-primary" href="/#">
                        <FaCode/>
                    </a>
                    <span className={'text-light'}>
                        Umrello
                    </span>
                </div>

                <div className="justify-content-center">
                    <span className={'text-light'}>
                        Made by <a className="text-primary" href="https://www.linkedin.com/in/alex-naida/">Alex Naida</a> && <a className='text-primary' href='https://www.linkedin.com/in/kris-petrov/'>Yan Petrov</a> && <a className={'text-primary'} href={'https://www.linkedin.com/in/stephanie-staykova-65917b210/'}>Steph Staykova</a>
                    </span>
                </div>

                <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                    <li>
                        <span className={'text-light'}>ELSYS / TUES</span>
                    </li>
                    <li className="ms-3">
                        <a href={"https://www.tues.bg/"} rel="noopener noreferrer" target="_blank" className={'text-primary'}>
                            <FaGlobe/>
                        </a>
                    </li>
                    <li className="ms-3">
                        <a href={"https://www.instagram.com/tues.bg/"} rel="noopener noreferrer" target="_blank" className={'text-primary'}>
                            <FaInstagram/>
                        </a>
                    </li>
                    <li className="ms-3">
                        <a href={"https://www.linkedin.com/school/tues/"} rel="noopener noreferrer" target="_blank" className={'text-primary'}>
                            <FaLinkedin/>
                        </a>
                    </li>
                </ul>
            </Container>
        </footer>
    )
}

export default Footer;