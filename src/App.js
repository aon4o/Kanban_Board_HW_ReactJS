import {BrowserRouter, Routes, Route} from "react-router-dom";
import NoPage from "./views/NoPage";
import Base from "./components/layout/Base";
import AuthContext from "./utils/authContext";
import {useState} from "react";
import Home from "./views/Home";
import Register from "./views/Register";
import Login from "./views/Login";

function App() {

    const [username, setUsername] = useState(undefined);

    return (
        <AuthContext.Provider value={{username, setUsername}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Base />}>
                        <Route index element={<Home />} />
                        
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
