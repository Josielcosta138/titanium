import { FC } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/login";
import RecoverPassword from "./components/recuperarsenha";
import OrderService from "./ordem/ordemdeservico";
import OrderCliente from "./ordem/clientesordem";
import ListaCliente from "./pages/listaclientes";
import CadastroOrdemServico from "./ordem/ordemdeservico";
import ListaOrdemServico from "./pages/listaservicoordem";
import MateriaPrima from "./pages/materia";
import TelaInicial from "./pages/telaInicial";
import Relatorios from "./pages/telaRelatorio";
import OrdemCorte from "./pages/ordemCorte";
// import Home from "./pages/Home";

const Router : FC = () => { 
    return(
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<Navigate to="/home"/>}/> */}
                {/* <Route path="/home" element={<Home />} index/> */}
                <Route path="/login" element={<Login />} />
                <Route path="/recuperarSenha" element={<RecoverPassword />} />
                <Route path="/ordemCliente" element={<OrderCliente />} />
                <Route path="/listaCliente" element={<ListaCliente />} />
                <Route path="/ordemServico" element={<CadastroOrdemServico />} />
                <Route path="/listaServico" element={<ListaOrdemServico />} />
                <Route path="/ordemCliente/:id" element={<OrderCliente />} />
                <Route path="/materiaPrima" element={<MateriaPrima />} />
                <Route path="/telaInicial" element={<TelaInicial />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/ordemCorte" element={<OrdemCorte />} />


              
            </Routes>
        </BrowserRouter>
    );
}
export default Router;