import React from 'react';
import './index.css';
import Sidebar from '../../components/Sidebar';

const ProfileSettings: React.FC = () => {
  return (
    <div className="profile-settings">

      <Sidebar></Sidebar>

      <div className="main-content">
        <header className="header">
          <img src="path/to/logo.png" alt="TITANIUM Logo" className="logo" />
          <button className="back-button">←</button>
          <input type="text" className="search-bar" placeholder="Pesquisar..." />
          <button className="notification-icon">🔔</button>
        </header>

        <div className="content">
          <h2 className="main-title">CONFIGURAÇÕES</h2>
          <h3 className="subtitle">INFORMAÇÕES DE PERFIL</h3>

          <div className="profile-image-container">
            <img src="path/to/profile.jpg" alt="Brian O'Connor" className="profile-img-rounded" />
            <p className="edit-photo">Editar Foto</p>
          </div>

          <section className="section">
            <h4>Dados da Conta</h4>
            <label>
              CNPJ:
              <input type="text" placeholder="00.000.000/0000-00" />
            </label>
            <label>
              Razão Social:
              <input type="text" placeholder="Razão Social Exemplo" />
            </label>
            <label>
              Nome Fantasia:
              <input type="text" placeholder="Nome Fantasia Exemplo" />
            </label>
          </section>

          <section className="section">
            <h4>Dados Pessoais</h4>
            <label>
              Nome:
              <input type="text" placeholder="Nome Completo" />
            </label>
            <label>
              E-mail:
              <input type="email" placeholder="exemplo@dominio.com" />
            </label>
            <label>
              Telefone/Celular:
              <input type="text" placeholder="(00) 00000-0000" />
            </label>
          </section>

          <section className="section">
            <h4>Endereço</h4>
            <label>
              CEP:
              <input type="text" placeholder="00000-000" />
            </label>
            <label>
              Logradouro:
              <input type="text" placeholder="Rua/Avenida" />
            </label>
            <label>
              Rua:
              <input type="text" placeholder="Número, Bloco, etc." />
            </label>
            <label>
              Bairro:
              <input type="text" placeholder="Bairro" />
            </label>
            <label>
              Cidade:
              <input type="text" placeholder="Cidade" />
            </label>
            <label>
              Estado (UF):
              <input type="text" placeholder="Estado" />
            </label>
            <label>
              Complemento:
              <input type="text" placeholder="Informações Adicionais" />
            </label>
          </section>

          <section className="section">
            <h4>Observações</h4>
            <label>
              Observação:
              <textarea placeholder="Observações gerais, problemas, lembretes, etc." />
            </label>
          </section>

          <button className="confirm-button">CONFIRMAR</button>

          <p className="required-fields">* Campos obrigatórios</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
