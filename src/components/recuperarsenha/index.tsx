import React, { FC, useState } from "react";
import "./index.css";
import { apiPost, apiPut, STATUS_CODE } from "../../api/RestClient";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Modal } from "@mui/material";

const RecoverPassword: FC = () => {
  const [emailAntigo, setEmailAntigo] = useState<string>("");
  const [senhaAntiga, setSenhaAntiga] = useState<string>("");
  const [emailNovo, setEmailNovo] = useState<string>("");
  const [senhaNova, setSenhaNova] = useState<string>("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const validarSenhaAntiga = async () => { 
    
    const data = {
      login: emailAntigo,
      senha: senhaAntiga
    }
    try {
      const response = await apiPost(`/usuarios/autenticar`, data);

      if (response.status === STATUS_CODE.OK) {
        const token = response.data.token;
        setTimeout(() => {          
          sessionStorage.setItem("token", token);
          recuperarSenha();
        },1000);    
      }
    } catch (error) {
      console.error("Erro! Login ou Senha inválidos", error);
    }
  }; 

  const recuperarSenha = async () => { 
    
    const idUsuario = localStorage.getItem("idUsuario");
    const data = {
      login: emailNovo,
      senha: senhaNova
    }
    try {
      const response = await apiPut(`/usuarios/recuperarSenha/${Number(idUsuario)}`, data);
      
      if (response.status === STATUS_CODE.OK) {
        const token = response.data.token;
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          sessionStorage.setItem("token", token);
          redericionarLogin();
        },1000);    
      }
    } catch (error) {
      console.error("Erro! Login ou Senha inválidos", error);
    }
  }; 

  const redericionarLogin = () => {
    navigate('/login');
  }



  return (
    <div className="login-container">
      <div className="login-box">
        <div className="titulo-container">
          <div className="vertical-line-recuperar"></div>
          <h1 className="titulo">Titanium</h1>
        </div>
        <p className="subtitulo">Sistema Avançado de Controle de Corte</p>
        <p className="bem-vindo">Recuperar Senha</p>

        <div className="login-input-group">
          <label htmlFor="email" className="input-label">Login atual</label>
          <input
            type="email"
            id="email"
            value={emailAntigo}
            placeholder="Digite seu login"
            onChange={(e) => setEmailAntigo(e.target.value)}
            required
          />
          <label htmlFor="password" className="input-label">Senha atual</label>
          <input
            type="password"
            id="password"
            value={senhaAntiga}
            placeholder="Digite sua senha"
            onChange={(e) => setSenhaAntiga(e.target.value)}
            required
          />
        </div>
        <hr className="full-line" />


        <div className="login-input-group">
          <label htmlFor="email" className="input-label">Novo Login</label>
          <input
            type="email"
            id="novoEmail"
            value={emailNovo}
            placeholder="Digite seu novo login"
            onChange={(e) => setEmailNovo(e.target.value)}
            required
          />
          <label htmlFor="password" className="input-label">Nova Senha</label>
          <input
            type="password"
            id="novoPassword"
            value={senhaNova}
            placeholder="Digite sua nova senha"
            onChange={(e) => setSenhaNova(e.target.value)}
            required
          />

        </div>
        <button className="login-button" onClick={validarSenhaAntiga}>
          Salvar
        </button>

        <Modal open={open} onClose={() => setOpen(false)}>
            <Box className="alert-box" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
              <Alert variant="filled" sx={{ mb: 2 }}>Senha atualizada com sucesso. Realize Login!</Alert>
            </Box>
        </Modal>
      </div>
    </div>
  );
};

export default RecoverPassword;
