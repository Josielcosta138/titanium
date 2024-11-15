import { faChartBar, faCog, faHome, faList, faSignOutAlt, faTools, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import ConfirmarOC from '../../components/ModelConfirmacaoSairLogin';


const Sidebar: React.FC = () => {
  const user = {
    name: 'John Doe',
    role: 'Admin',
    profilePic: process.env.PUBLIC_URL + '/Logo.png',
  };
  const navigate = useNavigate();
  const [openConfirmarOC, setOpenConfirmarOC] = useState(false);



  const redirecionarLogin = () => {
    setOpenConfirmarOC(true);
  };


  const handleCloseConfirmarOC = (confirmed: boolean) => {
    setOpenConfirmarOC(false)

    if (confirmed) {
      sessionStorage.clear();
      navigate('/login');
    }
    else {
      navigate('/telaInicial');
    }
  };



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

        <button onClick={redirecionarLogin} className="logout-button">
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Sair
        </button> 
        <ConfirmarOC open={openConfirmarOC} onClose={handleCloseConfirmarOC} />
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li onClick={() => navigate('/telaInicial')}>
            <FontAwesomeIcon icon={faHome} className="icon" /> Início
          </li>
          <li onClick={() => navigate('/ordemCliente')}>
            <FontAwesomeIcon icon={faUserPlus} className="icon" /> Cadastro de Cliente
          </li>
          <li onClick={() => navigate('/ordemServico')}>
            <FontAwesomeIcon icon={faTools} className="icon" /> Ordem de Serviço
          </li>
          <li onClick={() => navigate('/listaServico')}>
            <FontAwesomeIcon icon={faList} className="icon" /> Listagem de Serviços
          </li>
          <li onClick={() => navigate('/listaCliente')}>
            <FontAwesomeIcon icon={faUsers} className="icon" /> Clientes
          </li>
          <li onClick={() => navigate('/relatorios')}>
            <FontAwesomeIcon icon={faChartBar} className="icon" /> Relatórios
          </li>
          <li onClick={() => navigate('/perfil')}>
            <FontAwesomeIcon icon={faCog} className="icon" /> Configurações
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

