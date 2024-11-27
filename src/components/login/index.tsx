import React, { FC, useState } from "react";
import "./index.css";
import { apiPost, STATUS_CODE } from "../../api/RestClient";
import { Alert, Box, IconButton, Modal, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import CloseIcon from "@mui/icons-material/Close";

const Login: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openSenhaInvalida, setOpenSenhaInvalida] = useState(false);
  const navigate = useNavigate();
  const [openModalMsg, setOpenModalMsg] = useState(false);
  const handleClose = () => setOpenModalMsg(false);
  const handleOpenModalMsg = () => setOpenModalMsg(true); 
 

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };


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
        <p 
          className="esqueceu-senha"  
          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          onClick={handleOpenModalMsg}>Esqueceu sua senha?
        </p> 
        <br />
        <Modal
          open={openModalMsg}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#FF6600",
                color: "white",
                p: 1,
                mb: 2,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Recuperação de Senha
              </Typography>
              <IconButton
                onClick={handleClose}
                sx={{ color: "white" }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Para recuperar sua senha, entre em contato com nossa equipe de suporte
              através dos seguintes canais:
              <br />
              <br />
              <WhatsAppIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              WhatsApp: <strong>(99) 9 9999-9999</strong>
              <br />
              <EmailIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              E-mail: <strong>titaniumSoftware@gmail.com.br</strong>
            </Typography>
          </Box>
        </Modal>
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
