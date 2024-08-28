import React, { FC, useState } from "react";
import "./index.css";

const Login: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    // Adicione a lógica de autenticação aqui
    console.log("Login attempt with", { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="titulo-container">
          <div className="vertical-line"></div>
          <h1 className="titulo">Titanium</h1>
        </div>
        <p className="subtitulo">Sistema Avançado de Controle de Corte</p>
        <p className="bem-vindo">SEJA BEM VINDO</p>

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
        <p className="esqueceu-senha">Esqueceu sua senha? <span className="redefinir-senha">Redefinir senha</span></p>
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
