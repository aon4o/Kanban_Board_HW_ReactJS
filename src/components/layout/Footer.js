import Container from "react-bootstrap/Container";
import {FaGithub, FaCode, FaHeart, FaCoffee, FaGlobe, FaInstagram, FaLinkedin} from "react-icons/fa";

const Footer = () => {
    return (
        <footer>
            <Container className="d-flex flex-wrap justify-content-between align-items-center py-3">
                <div className="col-md-4 d-flex align-items-center">
                    <a className="mb-3 me-3 mb-md-0 lh-1" href={"https://github.com/aon2003"}>
                        <FaGithub/>
                    </a>
                    <a className="mb-3 me-3 mb-md-0 lh-1" href="/#">
                        <FaCode/>
                    </a>
                    <span>
                        Kanban Board HW
                    </span>
                </div>

                <div className="justify-content-center">
                    <span>
                        {/*Made with <FaHeart/> and <FaCoffee/> by <a className="text-muted" href="https://www.linkedin.com/in/alex-naida/">Alex Naida</a>*/}
                    </span>
                </div>

                <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                    <li>
                        <span>ELSYS / TUES</span>
                    </li>
                    <li className="ms-3">
                        <a href={"https://www.tues.bg/"} rel="noopener noreferrer" target="_blank">
                            <FaGlobe/>
                        </a>
                    </li>
                    <li className="ms-3">
                        <a href={"https://www.instagram.com/tues.bg/"} rel="noopener noreferrer" target="_blank">
                            <FaInstagram/>
                        </a>
                    </li>
                    <li className="ms-3">
                        <a href={"https://www.linkedin.com/school/tues/"} rel="noopener noreferrer" target="_blank">
                            <FaLinkedin/>
                        </a>
                    </li>
                </ul>
            </Container>
        </footer>
    )
}

export default Footer;