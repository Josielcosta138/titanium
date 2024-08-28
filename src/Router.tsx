import { FC } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/login";
// import Home from "./pages/Home";

const Router : FC = () => {
    return(
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<Navigate to="/home"/>}/> */}
                {/* <Route path="/home" element={<Home />} index/> */}
                <Route path="/login" element={<Login />} />
                {/* <Route path="*" element={<Home />} /> */}
            </Routes>
        </BrowserRouter>
    );
}
export default Router;