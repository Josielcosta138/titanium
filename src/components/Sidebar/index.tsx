import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserPlus, faTools, faList, faUsers, faChartBar, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './index.css';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const user = {
    name: 'John Doe',
    role: 'Admin',
    profilePic: process.env.PUBLIC_URL + '/Logo.png',
  };
  const navigate = useNavigate();


  const redericionarLogin =() => {
    sessionStorage.clear();
    navigate('/login');
  }
 

  return (
    <div className="sidebar">
      <div className="titulo-container">
        <div className="vertical-line-sidebar"></div>
        <div className="titulo">TITANIUM</div>
      </div>
      <div className="profile-pic">
        <img src={user.profilePic} alt="Profile" />
      </div>
      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-role">{user.role}</div>
        <button 
          onClick={redericionarLogin}
          className="logout-button"
          >
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Sair
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><FontAwesomeIcon icon={faHome} className="icon" /> Início</li>
          <li><FontAwesomeIcon icon={faUserPlus} className="icon" /> Cadastro de Cliente</li>
          <li><FontAwesomeIcon icon={faTools} className="icon" /> Ordem de Serviço</li>
          <li><FontAwesomeIcon icon={faList} className="icon" /> Listagem de Serviços</li>
          <li><FontAwesomeIcon icon={faUsers} className="icon" /> Clientes</li>
          <li><FontAwesomeIcon icon={faChartBar} className="icon" /> Relatórios</li>
          <li><FontAwesomeIcon icon={faCog} className="icon" /> Configurações</li>
{/* 
          FAZERRRRR EHHEEHEEHHEHEHEHEHHEHEHEHEHEHHE QUERO MORREEEE BRINCADERA VALORIZE A VIDA AMEM IRMAO <li onClick={redirecionarCadastroDeClientes}>Cadastro de Cliente</li>
            <li onClick={redirecionarCadastroOs}>Ordem de Serviço</li>
            <li onClick={redirecionarParaListaDeOs}>Listagem de Serviços</li>
            <li onClick={redirecionarListaDeClientes}>Clientes</li>
            <li onClick={redirecionarRelatorios}>Relatórios</li>

           */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
