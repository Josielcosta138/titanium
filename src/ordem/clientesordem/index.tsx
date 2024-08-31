import React from 'react';
import './index.css';

const CadastroCliente: React.FC = () => {
  return (
    <div className="cadastro-cliente-container">
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
            <li>Listagem de Serviços</li>
            <li>Clientes</li>
            <li>Relatórios</li>
            <li>Configurações</li>
          </ul>
        </nav>
      </div>

      <div className="content-container">
        {/* Barra Superior */}
        <div className="top-bar">
          <div className="top-left">
            <button className="back-button">
              <i className="fa fa-arrow-left"></i> Voltar
            </button>
            <h2>Cadastro de Cliente</h2>
          </div>
          <div className="top-right">
            <button className="icon-button">
              <i className="fa fa-cog"></i>
            </button>
            <button className="icon-button">
              <i className="fa fa-bell"></i>
            </button>
          </div>
        </div>

        {/* Linha Divisória */}
        <hr className="full-line" />

        {/* Botão e Filtros */}
        <div className="action-bar">
          <button className="service-list-button">Lista de Serviço</button>
          <div className="filter-container">
            <input type="text" placeholder="Pesquisar..." className="search-bar" />
            <button className="filter-button">Filtrar <i className="fa fa-caret-down"></i></button>
          </div>
        </div>

        {/* Formulário de Cadastro */}
        <div className="form-container">
          <div className="cadastro-cliente-form">
            {/* Seção Clientes */}
            <div className="section">
              <h3>Clientes</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nome">Nome*</label>
                  <input type="text" id="nome" placeholder="Nome do Cliente" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail*</label>
                  <input type="email" id="email" placeholder="exemplo@dominio.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="telefone">Número/Telefone*</label>
                  <input type="tel" id="telefone" placeholder="(00) 00000-0000" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cnpj">CNPJ*</label>
                  <input type="text" id="cnpj" placeholder="00.000.000/0000-00" required />
                </div>
                <div className="form-group">
                  <label htmlFor="nomeFantasia">Nome Fantasia</label>
                  <input type="text" id="nomeFantasia" placeholder="Nome Fantasia" />
                </div>
                <div className="form-group">
                  <label htmlFor="razaoSocial">Razão Social</label>
                  <input type="text" id="razaoSocial" placeholder="Razão Social" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pessoa1">Pessoa 1*</label>
                  <input type="text" id="pessoa1" placeholder="Nome da Pessoa 1" required />
                </div>
                <div className="form-group">
                  <label htmlFor="pessoa2">Pessoa 2</label>
                  <input type="text" id="pessoa2" placeholder="Nome da Pessoa 2" />
                </div>
                <div className="form-group">
                  <label htmlFor="pessoa3">Pessoa 3</label>
                  <input type="text" id="pessoa3" placeholder="Nome da Pessoa 3" />
                </div>
              </div>
            </div>

            {/* Linha Divisória */}
            <hr />

            {/* Seção Endereço */}
            <div className="section">
              <h3>Endereço</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cep">CEP*</label>
                  <input type="text" id="cep" placeholder="00000-000" required />
                </div>
                <div className="form-group">
                  <label htmlFor="logradouro">Logradouro*</label>
                  <input type="text" id="logradouro" placeholder="Logradouro" required />
                </div>
                <div className="form-group">
                  <label htmlFor="rua">Rua*</label>
                  <input type="text" id="rua" placeholder="Rua" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bairro">Bairro*</label>
                  <input type="text" id="bairro" placeholder="Bairro" required />
                </div>
                <div className="form-group">
                  <label htmlFor="cidade">Cidade*</label>
                  <input type="text" id="cidade" placeholder="Cidade" required />
                </div>
                <div className="form-group">
                  <label htmlFor="estado">Estado (UF)*</label>
                  <input type="text" id="estado" placeholder="UF" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="complemento">Complemento*</label>
                  <input type="text" id="complemento" placeholder="Complemento" required />
                </div>
                <div className="form-group">
                  <label htmlFor="numero">Número*</label>
                  <input type="text" id="numero" placeholder="Número" required />
                </div>
              </div>
            </div>

            {/* Linha Divisória */}
            <hr />

            {/* Seção Outros */}
            <div className="section">
              <h3>Outros</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="observacao">Observação</label>
                  <textarea id="observacao" placeholder="Observações adicionais"></textarea>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-button">Cadastrar Cliente</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroCliente;
