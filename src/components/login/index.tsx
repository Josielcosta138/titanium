import React, { FC, useState } from "react";
import "./index.css";
import { apiPost, STATUS_CODE } from "../../api/RestClient";
import { Alert, Box, Modal } from "@mui/material";
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Login: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openSenhaInvalida, setOpenSenhaInvalida] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    
    const data = {
      login: email,
      senha: password
    }

    try {
      const response = await apiPost(`/usuarios/autenticar`, data);

      if (response.status === STATUS_CODE.OK) {
        const token = response.data.token;
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          sessionStorage.setItem("token", token);
          redirecionarTelaInicial(); 
        },1000);    
      }
      else if (response.status === STATUS_CODE.UNAUTHORIZED) {
        setOpenSenhaInvalida(true);

        setTimeout(() => {          
          setOpenSenhaInvalida(false);
        },1000);    
      }

    } catch (error) {    
      console.error("Erro! Login ou Senha inválidos", error);
    }
  };


  const redirecionarTelaInicial = () =>{
    navigate('/telaInicial')
  }


  return ( 
    <div className="login-container">
      <div className="login-box">
        <div className="titulo-container">
          <div className="vertical-line-login"></div>
          <h1 className="titulo">Titanium</h1>
        </div>
        <p className="subtitulo">Sistema Avançado de Controle de Corte</p>
        <p className="bem-vindo">SEJA BEM-VINDO</p>

        <div className="login-input-group">
          <label htmlFor="E-mail" className="input-label">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Digite seu e-mail"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-input-group">
          <label htmlFor="password" className="input-label">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Digite sua senha"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p className="esqueceu-senha">Esqueceu sua senha?</p>
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
        <Modal open={open} onClose={() => setOpen(false)}>
              <Box className="alert-box" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
                  <Alert variant="filled" sx={{ mb: 2 }}>Login realizado com sucesso!</Alert>
              </Box>
        </Modal>

        <Modal open={openSenhaInvalida} onClose={() => setOpenSenhaInvalida(false)}>
              <Box className="alert-box" sx={{ 
                    position: 'fixed', 
                    top: 16, 
                    left: '50%',
                    transform: 'translateX(-50%)', 
                    zIndex: 9999,
                    maxWidth: 250,
                    width: '100%', 
                  }}>
                  <Alert variant="filled" severity="error" sx={{ mb: 2 }}>Login ou senha inválidos!</Alert>
              </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Login;
