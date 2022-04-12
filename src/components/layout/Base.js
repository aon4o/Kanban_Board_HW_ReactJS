import Navbar from "./Navbar";
import Footer from "./Footer";
import {Outlet} from "react-router-dom";

const Base = () => {
    return (
        <>
            <Navbar />

            <Outlet />

            <Footer />
        </>
    );
};

export default Base;
