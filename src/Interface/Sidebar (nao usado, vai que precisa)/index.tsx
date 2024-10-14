import React from 'react';
import './index.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="titulo-container">
        <div className="vertical-line"></div>
        <div className="titulo">Titanium</div>
      </div>
      <div className="profile-pic">
        <img src="https://via.placeholder.com/80" alt="Profile" />
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>Início</li>
          <li>Cadastro de Cliente</li>
          <li>Ordem de Serviço</li>
          <li>Lista de Serviços</li>
          <li>Lista de Clientes</li>
          <li>Relatórios</li>
          <li>Configurações</li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
