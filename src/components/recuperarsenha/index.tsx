import React, { FC, useState } from "react";
import "./index.css";

const RecoverPassword: FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleRecover = () => { 
    // Lógica para recuperar a senha teste 
    console.log("Password recovery attempt with", { email });
  }; 

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
          <label htmlFor="email" className="input-label">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Digite seu email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="login-button" onClick={handleRecover}>
          Recuperar Senha
        </button>
      </div>
    </div>
  );
};

export default RecoverPassword;
