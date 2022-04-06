import Navbar from "./Navbar";
import Footer from "./Footer";
import {Outlet} from "react-router-dom";
import {Container} from "react-bootstrap";

const Base = () => {
    return (
        <>
            <Navbar />

            <Container className="my-5">
                <Outlet />
            </Container>

            <Footer />
        </>
    );
};

export default Base;
