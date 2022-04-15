import {BrowserRouter, Routes, Route} from "react-router-dom";
import NoPage from "./views/NoPage";
import Base from "./components/layout/Base";
import AuthContext from "./utils/authContext";
import {useState} from "react";
import Home from "./views/Home";
import Register from "./views/Register";
import Login from "./views/Login";
import Profile from "./views/Profile";
import Boards from "./views/Boards/Boards";
import Board from "./views/Boards/Board";

function App() {

    const [user, setUser] = useState(undefined);

    return (
        <AuthContext.Provider value={{user: user, setUser: setUser}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Base />}>
                        <Route index element={<Home />} />

                        <Route path='boards'>
                            <Route index element={<Boards />} />
                            <Route path=":name" element={<Board />} />
                        </Route>

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />

                        <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
