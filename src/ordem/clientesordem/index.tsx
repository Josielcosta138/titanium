import React, { useEffect, useState } from 'react';
import './index.css';
import { FaSearch, FaArrowLeft } from "react-icons/fa"; // Importe o ícone de voltar
// import { FaSearch } from "react-icons/fa";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { apiGet, apiPost, apiPut, STATUS_CODE } from '../../api/RestClient';
import { Alert, Box, Modal } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IClientes } from '../../Interface/Cliente/type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faCog, faBell } from '@fortawesome/free-solid-svg-icons';
import './index.css'; // Certifique-se de criar e importar seu arquivo CSS

const CadastroCliente: React.FC = () => {
  const [clientes, setClientes] = useState<IClientes[]>([]);
  const { id } = useParams<{ id: string }>();
  const [nome, setNome] = useState<string>('');
  const [searchCnpj, setSearchCnpj] = useState<string>('');
  const [razaoSocial, setRazaoSocial] = useState<string>('');
  const [nomeFantasia, setNomeFantasia] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telefone, setTelefone] = useState<string>('');
  const [cnpj, setCnpj] = useState<string>('');
  const [bairro, setBairro] = useState<string>('');
  const [municipio, setMunicipio] = useState<string>('');
  const [uf, setUf] = useState<string>('');
  const [logradouro, setLogradouro] = useState<string>('');
  const [rua, setRua] = useState<string>('');
  const [cep, setCep] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [clienteId, setIdCliente] = useState<number>();
  const [cidadeId, setIdCidade] = useState<number>();
  const location = useLocation();
  const navigate = useNavigate();




  useEffect(() => {
    if (id) {
      carregarCliente(Number(id));
    }
  }, [id]);

  const carregarCliente = async (id: number) => {
    try {
      const response = await apiGet(`endereco/carregar/${id}`);
      if (response.status === STATUS_CODE.OK) {
        const cliente = response.data;

        setNomeFantasia(cliente.client.nomeFantasia || "");
        setEmail(cliente.client.email || "");
        setTelefone(cliente.client.telefone || "");
        setCnpj(cliente.client.cnpj || "");
        setRazaoSocial(cliente.client.razaoSocial || "");
        setBairro(cliente.bairro || "");
        setMunicipio(cliente.cidades.name || "");
        setUf(cliente.cidades.uf || "");
        setLogradouro(cliente.rua || "");
        // Definir o cep no back 
        setCep(cliente.cep || "");
        setIdCliente(cliente.client.id || "");
        setIdCidade(cliente.cidades.id || "");

      }
    } catch (error) {
      console.error("Erro ao carregar dados do cliente:", error);
    }
  };


  const gerenciarSalvar = () => {
    if (id) {
      edidarCliente();
    } else {
      salvarCliente();
    }
  }




  // ----------------------- PUT -------------------------------------//

  const edidarCliente = async () => {
    const data = {
      nome: razaoSocial,
      fantasia: nomeFantasia,
      email: email,
      telefone: telefone,
      cnpj: cnpj,

    }

    try {
      const response = await apiPut(`/cliente/atualizarCliente/${Number(clienteId)}`, data);
      if (response.status === STATUS_CODE.OK) {

        const clienteId = response.data.id;
        setIdCliente(clienteId);
        localStorage.setItem("idCliente", clienteId.toString());

        await edidarCidade(clienteId);
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };


  const edidarCidade = async (clienteId: any) => {

    const data = {
      name: municipio,
      uf: uf,
    }


    try {
      const response = await apiPut(`/cidade/atualizarCidade/${Number(cidadeId)}`, data);
      if (response.status === STATUS_CODE.OK) {

        const cidadeId = response.data.id;
        setIdCidade(cidadeId);
        localStorage.setItem("idCidade", cidadeId);

        await editarEndereco(clienteId, cidadeId);

      }
    } catch (error) {
      console.error("Erro ao salvar cidade:", error);
    }
  };







  const editarEndereco = async (clienteId: any, cidadeId: any) => {
    const data = {
      rua: logradouro,
      bairro: bairro,
      idCliente: clienteId,
      idCidade: cidadeId,
    };

    try {
      const response = await apiPut(`/endereco/atualizar/${id}`, data);
      if (response.status === STATUS_CODE.OK) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
    }
  };






  // ------------------------------ POST ----------------------------------//

  const formatarCnpj = (searchCnpj: string) => {
    return searchCnpj.replace(/\D/g, '');
  };

  const carregarClienteViaCnpj = async () => {
    try {
      const cnpjFormatado = formatarCnpj(searchCnpj);
      console.log(">>> Cnpj: ", cnpjFormatado);

      const response = await apiGet(`cliente/carregarDadosApis/${cnpjFormatado}`);

      if (response.status === STATUS_CODE.OK) {
        console.log(response);

        const dadosCliente = response.data;
        setNome(dadosCliente.nome || "");
        setNomeFantasia(dadosCliente.fantasia || "");
        setEmail(dadosCliente.email || "");
        setTelefone(dadosCliente.telefone || "");
        setCnpj(dadosCliente.cnpj || "");
        setRazaoSocial(dadosCliente.nome || "");
        setBairro(dadosCliente.bairro || "");
        setMunicipio(dadosCliente.municipio || "");
        setUf(dadosCliente.uf || "");
        setLogradouro(dadosCliente.logradouro || "");
        setCep(dadosCliente.cep || "");

      }
    } catch (error) {
      console.error("Erro ao carregar dados do cliente e endereços:", error);
    }
  };



  const salvarCliente = async () => {
    const data = {
      fantasia: nomeFantasia,
      telefone: telefone,
      cnpj: cnpj,
      nome: nome,
      email: email,
    };

    try {
      const response = await apiPost(`/cliente/criarClientes`, data);

      if (response.status === STATUS_CODE.CREATED) {
        const clienteId = response.data.id;
        setIdCliente(clienteId);
        localStorage.setItem("idCliente", clienteId);

        await salvarCidade(clienteId);
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  };





  const salvarEndereco = async (clienteId: any, cidadeId: any) => {
    const data = {
      rua: logradouro,
      bairro: bairro,
      idCliente: clienteId,
      idCidade: cidadeId,
    };

    try {
      const response = await apiPost("/endereco/criar", data);
      if (response.status === STATUS_CODE.CREATED) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
    }
  };





  const salvarCidade = async (clienteId: any) => {
    const data = {
      name: municipio,
      uf: uf,
    };

    try {
      const response = await apiPost("/cidade/criarCidade", data);

      if (response.status === STATUS_CODE.CREATED) {
        const cidadeId = response.data.id;
        setIdCidade(cidadeId);
        localStorage.setItem("idCidade", cidadeId);

        await salvarEndereco(clienteId, cidadeId);
      }
    } catch (error) {
      console.error("Erro ao salvar cidade:", error);
    }
  }


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
            {/* <button className="back-button">
              <i className="fa fa-arrow-left"></i> Voltar
            </button> */}
            <button className="back-button">
              <FaArrowLeft /> Voltar {/* Ícone de voltar adicionado aqui */}
            </button>
            <h2>Cadastro de Cliente</h2>
          </div>
          <div className="top-right">
            <button className="icon-button">
              <FontAwesomeIcon icon={faCog} className="icon" />
            </button>
            <button className="icon-button">
              <FontAwesomeIcon icon={faBell} className="icon" />
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
            {/* Campo de Pesquisa por CNPJ */}
            <div className="search-cnpj-container">
              <div className="form-group search-cnpj-group">
                <label htmlFor="searchCnpj">Pesquisar Cliente: </label>
                <div className="search-cnpj-input">
                  <input
                    type="text"
                    id="searchCnpj"
                    placeholder="00.000.000/0000-00"
                    value={searchCnpj}
                    onChange={(e) => setSearchCnpj(e.target.value)}
                  />
                  <button type="button" onClick={carregarClienteViaCnpj} className="search-button">
                    <PersonSearchIcon />
                  </button>
                </div>
              </div>
            </div>
            {/* Seção Clientes */}
            <div className="section">
              <h3>Informações do Cliente</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nome">Nome<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="nome"
                    value={nomeFantasia}
                    onChange={(event) => setNomeFantasia(event.target.value)}
                    placeholder="Nome do Cliente" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail<span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="exemplo@dominio.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="telefone">Número/Telefone<span className="required">*</span></label>
                  <input
                    type="tel"
                    id="telefone"
                    value={telefone}
                    onChange={(event) => setTelefone(event.target.value)}
                    placeholder="(00) 00000-0000" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cnpj">CNPJ<span className="required">*</span></label>
                  <input
                    type="text"
                    id="cnpj"
                    value={cnpj}
                    onChange={(event) => setCnpj(event.target.value)}
                    placeholder="00.000.000/0000-00" required />
                </div>
                <div className="form-group">
                  <label htmlFor="nomeFantasia">Nome Fantasia</label>
                  <input
                    type="text"
                    id="nomeFantasia"
                    value={nomeFantasia}
                    onChange={(event) => setNomeFantasia(event.target.value)}
                    placeholder="Nome Fantasia" />
                </div>
                <div className="form-group">
                  <label htmlFor="razaoSocial">Razão Social</label>
                  <input
                    type="text"
                    id="razaoSocial"
                    value={razaoSocial}
                    onChange={(event) => setRazaoSocial(event.target.value)}
                    placeholder="Razão Social" />
                </div>
              </div>
            </div>

            {/* Linha Divisória */}
            <hr className="custom-divider" />

            {/* Seção Endereço */}
            <div className="sectionEndereco">
              <h3>Endereço</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cep">CEP<span className="required">*</span></label>
                  <input
                    type="text"
                    id="cep"
                    value={cep}
                    onChange={(event) => setCep(event.target.value)}
                    placeholder="00000-000" required />
                </div>
                <div className="form-group">
                  <label htmlFor="rua">Rua<span className="required">*</span></label>
                  <input
                    type="text"
                    id="rua"
                    value={rua}
                    onChange={(event) => setRua(event.target.value)}
                    placeholder="Rua" required />
                </div>
              </div>
              {/* <div className="form-group">
                  <label htmlFor="rua">Rua<span className="required">*</span></label>
                  <input 
                        type="text" 
                        id="rua" 
                        value={rua}
                        onChange={(event) => setRua(event.target.value)}
                        placeholder="Rua" required />
                </div> */}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bairro">Bairro<span className="required">*</span></label>
                  <input
                    type="text"
                    id="bairro"
                    value={bairro}
                    onChange={(event) => setBairro(event.target.value)}
                    placeholder="Bairro" required />
                </div>
                <div className="form-group">
                  <label htmlFor="cidade">Cidade<span className="required">*</span></label>
                  <input
                    type="text"
                    id="cidade"
                    value={municipio}
                    onChange={(event) => setMunicipio(event.target.value)}
                    placeholder="Cidade" required />
                </div>
                <div className="form-group">
                  <label htmlFor="estado">Estado (UF)<span className="required">*</span></label>
                  <input
                    type="text"
                    id="estado"
                    value={uf}
                    onChange={(event) => setUf(event.target.value)}
                    placeholder="UF" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="complemento">Complemento*</label>
                  <input type="text" id="complemento" placeholder="Complemento" required />
                </div>
                <div className="form-group">
                  <label htmlFor="numero">Número<span className="required">*</span></label>
                  <input type="text" id="numero" placeholder="Número" required />
                </div>
              </div>
            </div>

            {/* Linha Divisória */}
            <hr className="custom-divider" />

            {/* Seção Outros */}
            <div className="sectionObservacoes">
              <h3>Outros</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="observacao">Observação</label>
                  <textarea id="observacao" placeholder="Observações adicionais"></textarea>
                </div>
              </div>
            </div>

            <button
              onClick={gerenciarSalvar}
              type="submit"
              className="submit-button">
              <FontAwesomeIcon icon={faSave}
                className="icon" />      Salvar Cliente
            </button>

            {/* Mensagem de sucesso */}
            <Modal
              open={open}
              onClose={() => setOpen(false)}
            >
              <Box className="alert-box" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
                <Alert variant="filled" sx={{ mb: 2 }}>Cliente e endereço cadastrados com sucesso!</Alert>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroCliente;
