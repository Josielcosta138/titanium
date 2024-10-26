import React, { useEffect, useState } from 'react';
import './index.css';
import Sidebar from '../../components/Sidebar';
import { FaArrowLeft } from "react-icons/fa"; // Ícone de voltar
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { apiGet, apiPost, apiPut, STATUS_CODE } from '../../api/RestClient';
import { Alert, Box, Modal, styled } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IClientes } from '../../Interface/Cliente/type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCog, faBell } from '@fortawesome/free-solid-svg-icons';
import {
  Avatar,
  Button,
  Typography,
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import HttpsIcon from '@mui/icons-material/Https';

// Renomeando para evitar conflito de nomes
const StyledInput = styled('input')({
  display: 'none',
});

const PerfilConfig: React.FC = () => {
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

  // Estado para a imagem do perfil
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=100&width=100");

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
        setCep(cliente.cep || "");
        setIdCliente(cliente.client.id || undefined);
        setIdCidade(cliente.cidades.id || undefined);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do cliente:", error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const gerenciarSalvar = () => {
    if (id) {
      edidarCliente();
    } else {
      salvarCliente();
    }
  };

  // ----------------------- PUT -------------------------------------//

  const edidarCliente = async () => {
    const data = {
      nome: razaoSocial,
      fantasia: nomeFantasia,
      email: email,
      telefone: telefone,
      cnpj: cnpj,
    };

    try {
      const response = await apiPut(`/cliente/atualizarCliente/${Number(clienteId)}`, data);
      if (response.status === STATUS_CODE.OK) {
        const updatedClienteId = response.data.id;
        setIdCliente(updatedClienteId);
        localStorage.setItem("idCliente", updatedClienteId.toString());

        await edidarCidade(updatedClienteId);
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  const edidarCidade = async (clienteId: number) => {
    const data = {
      name: municipio,
      uf: uf,
    };

    try {
      const response = await apiPut(`/cidade/atualizarCidade/${Number(cidadeId)}`, data);
      if (response.status === STATUS_CODE.OK) {
        const updatedCidadeId = response.data.id;
        setIdCidade(updatedCidadeId);
        localStorage.setItem("idCidade", updatedCidadeId.toString());

        await editarEndereco(clienteId, updatedCidadeId);
      }
    } catch (error) {
      console.error("Erro ao salvar cidade:", error);
    }
  };

  const editarEndereco = async (clienteId: number, cidadeId: number) => {
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
        const newClienteId = response.data.id;
        setIdCliente(newClienteId);
        localStorage.setItem("idCliente", newClienteId.toString());

        await salvarCidade(newClienteId);
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  };

  const salvarEndereco = async (clienteId: number, cidadeId: number) => {
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
          window.location.reload();
        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
    }
  };

  const salvarCidade = async (clienteId: number) => {
    const data = {
      name: municipio,
      uf: uf,
    };

    try {
      const response = await apiPost("/cidade/criarCidade", data);

      if (response.status === STATUS_CODE.CREATED) {
        const newCidadeId = response.data.id;
        setIdCidade(newCidadeId);
        localStorage.setItem("idCidade", newCidadeId.toString());

        await salvarEndereco(clienteId, newCidadeId);
      }
    } catch (error) {
      console.error("Erro ao salvar cidade:", error);
    }
  };

  const redirecionarListaDeClientes = () => {
    navigate('/listaCliente');
  };

  const redirecionarTelaInicial = () => {
    navigate('/telaInicial');
  };


  return (
    <div className="profile-settings">
      <Sidebar />
  
      <div className="main-content">
          <div className="cadastro-cliente-container">
  
            <div className="content-container">
              <div className="top-bar">
                <div className="top-left">
                  <button className="back-button" onClick={redirecionarTelaInicial}>
                    <FaArrowLeft /> Voltar
                  </button>
                  <h2>Perfil Usuário</h2>
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
              <hr className="full-line" />
  
              <div className="action-bar">
                <button
                  onClick={redirecionarListaDeClientes}
                  className="service-list-button"
                  style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                  <PersonSearchIcon style={{ marginRight: '8px' }} />
                  Lista de Usuários
                </button>
              </div>
  
              <div className="form-container">
                <div className="cadastro-cliente-form">
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar
                      src={profileImage}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    />
                    <label htmlFor="icon-button-file">
                      <StyledInput
                        accept="image/*"
                        id="icon-button-file"
                        type="file"
                        onChange={handleImageChange}
                      />
                      <Button
                        variant="text"
                        component="span"
                        startIcon={<EditNoteIcon />}
                        sx={{ color: 'orange' }}>
                        Editar Foto
                      </Button>
                    </label>
                    <Button
                      variant="text"
                      component="span"
                      startIcon={<HttpsIcon />}
                      sx={{ color: 'orange' }}>
                      Redefinir senha
                    </Button>
                  </div>
  
                  <hr className="full-line" style={{ marginBottom: '60px' }} />
  
                  <div className="section">
                    <h2>Informações do Usuário</h2>
                    <hr className="full-line" />
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
  
                    <hr className="full-line" style={{ marginBottom: '60px' }} />
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
  
                    <hr className="full-line" style={{ marginBottom: '60px' }} />
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
                    <hr className="custom-divider" />
  
                    <Button
                      onClick={gerenciarSalvar}
                      variant="contained"
                      startIcon={<FontAwesomeIcon icon={faSave} className="icon" />}
                      sx={{
                        background: '#ed6c02',
                        color: 'white',
                        border: '1px solid',
                        justifyContent: 'center',
                        width: '200px',
                        height: '50px',
                        display: 'block',
                        margin: '20px auto',
                        '&:hover': {
                          background: '#e55b00',
                        },
                      }}>
                      Salvar Usuário
                    </Button>
  
                    <Modal open={open} onClose={() => setOpen(false)}>
                      <Box className="alert-box" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
                        <Alert variant="filled" sx={{ mb: 2 }}>Cliente e endereço cadastrados com sucesso!</Alert>
                      </Box>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PerfilConfig;
