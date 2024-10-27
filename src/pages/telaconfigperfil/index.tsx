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
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import perfilUser from '../../../public/Logo.png'

// Renomeando para evitar conflito de nomes
const StyledInput = styled('input')({
  display: 'none',
});

const PerfilConfig: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nome, setNome] = useState<string>('');
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
  const [idUsuario, setIdUsuario] = useState<number>();
  const [idEndereco, setIdEndereco] = useState<number>();
  const location = useLocation();
  const navigate = useNavigate();

  

  useEffect(() => {    
      carregarCliente();
  },[]);

  const carregarCliente = async () => {
    try {
      const response = await apiGet(`enderecoUsuario/carregar`);
      if (response.status === STATUS_CODE.OK) {
        const [user] = response.data;

        if(user){
          setNomeFantasia(user.usuario.nomeFantasia || "");
          setEmail(user.usuario.email || "");
          setTelefone(user.usuario.telefone || "");
          setCnpj(user.usuario.cnpj || "");
          setRazaoSocial(user.usuario.razaoSocial || "");
          setBairro(user.bairro || "");
          setMunicipio(user.cidades.name || "");
          setUf(user.cidades.uf || "");
          setRua(user.rua || "");
          setCep(user.cep || "");
          setIdCliente(user.usuarioId || undefined);
          setIdCidade(user.cidadeId || undefined);
          setIdUsuario(user.usuario.id || undefined);
          setIdEndereco(user.id || undefined);   
          
          
          if (user.usuarioId) {
            localStorage.setItem("idUsuario", user.usuarioId.toString());
          }
        }        
      }
      

    } catch (error) {
      console.error("Erro ao carregar dados do cliente:", error);
    }
  };


 



  // ----------------------- PUT -------------------------------------//
  const edidarCliente = async () => {
    const data = {
      razaoSocial: razaoSocial,
      nomeFantasia: nomeFantasia,
      email: email,
      telefone: telefone,
      cnpj: cnpj,
    };

    try {
      const response = await apiPut(`usuarios/atualizarUsuarios/${Number(idUsuario)}`, data);

      if (response.status === STATUS_CODE.OK) {
        
        const updatedUsuarioId = response.data.id;
        localStorage.setItem("idUsuario", updatedUsuarioId.toString());
        
        await edidarCidade(updatedUsuarioId);
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  const edidarCidade = async (usuarioId: number) => {
    const data = {
      name: municipio,
      uf: uf,
    };

    try {
      const response = await apiPut(`cidadeUsuario/atualizarCidade/${Number(cidadeId)}`, data);

      if (response.status === STATUS_CODE.OK) {
        const updatedCidadeId = response.data.id;
        setIdCidade(updatedCidadeId);
        localStorage.setItem("idCidade", updatedCidadeId.toString());

        await editarEndereco(usuarioId, updatedCidadeId);
      }
    } catch (error) {
      console.error("Erro ao salvar cidade:", error);
    }
  };

  const editarEndereco = async (usuarioId: number, cidadeId: number) => {
    const data = {
      rua: rua,
      bairro: bairro,
      idUsuario: usuarioId,
      idCidade: cidadeId,
    };

    try {
      const response = await apiPut(`enderecoUsuario/atualizar/${idEndereco}`, data);

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




  const redirecionarTelaInicial = () => {
    navigate('/telaInicial');
  };

  const redirecionarRedefinirSenha = () => {
    navigate('/recuperarSenha');
  }

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
                  
              <div className="form-container">
                <div className="cadastro-cliente-form">
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar
                      src={`/perfilUser.jpg`}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    />
                    <label >
                    <Button                      
                      variant="text"
                      component="span"
                      startIcon={<ManageAccountsIcon sx={{ width: 30, height: 30 }} />}
                      sx={{ color: 'blue' }}>
                      {nomeFantasia}
                    </Button>
                    </label>


                    <Button
                      onClick={redirecionarRedefinirSenha}
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
                      <label> CNPJ:</label>
                        <input 
                         type="text" 
                         id="cnpj"
                         value={cnpj}
                         onChange={(event) => setCnpj(event.target.value)} 
                         placeholder="00.000.000/0000-00" 
                        />
                      <label>Razão Social:</label>
                        <input
                        type="text"
                        id="razaoSocial"
                        value={razaoSocial}
                        onChange={(event) => setRazaoSocial(event.target.value)}
                        placeholder="Razão Social" /> 
                      <label htmlFor="nome">Nome-Usuário<span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="nome"
                        value={nomeFantasia}
                        onChange={(event) => setNomeFantasia(event.target.value)}
                        placeholder="Nome do Cliente" required />
                      </section>
                    <hr className="full-line" style={{ marginBottom: '60px' }} />
                    <section className="section">
                      <h4>Dados Pessoais</h4>
                      <label htmlFor="email">E-mail<span className="required">*</span></label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="exemplo@dominio.com" required />
                      <label htmlFor="telefone">Número/Telefone<span className="required">*</span></label>
                      <input
                        type="tel"
                        id="telefone"
                        value={telefone}
                        onChange={(event) => setTelefone(event.target.value)}
                        placeholder="(00) 00000-0000" required />
                    </section>
  
                    <hr className="full-line" style={{ marginBottom: '60px' }} />
                    <section className="section">
                      <h4>Endereço</h4>
                      <label htmlFor="cep">CEP<span className="required">*</span></label>
                      <input
                        type="text"
                        id="cep"
                        value={cep}
                        onChange={(event) => setCep(event.target.value)}
                        placeholder="00000-000" required 
                      />           
                      <label htmlFor="rua">Rua<span className="required">*</span></label>
                      <input
                        type="text"
                        id="rua"
                        value={rua}
                        onChange={(event) => setRua(event.target.value)}
                        placeholder="Rua" required 
                      />
                     <label htmlFor="bairro">Bairro<span className="required">*</span></label>
                      <input
                        type="text"
                        id="bairro"
                        value={bairro}
                        onChange={(event) => setBairro(event.target.value)}
                        placeholder="Bairro" required 
                      />
                      <label htmlFor="cidade">Cidade<span className="required">*</span></label>
                      <input
                        type="text"
                        id="cidade"
                        value={municipio}
                        onChange={(event) => setMunicipio(event.target.value)}
                        placeholder="Cidade" required 
                      />
                     <label htmlFor="estado">Estado (UF)<span className="required">*</span></label>
                      <input
                        type="text"
                        id="estado"
                        value={uf}
                        onChange={(event) => setUf(event.target.value)}
                        placeholder="UF" required 
                      />               
                    </section>
                    <hr className="custom-divider" />
  
                    <Button
                      onClick={edidarCliente}
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
                        <Alert variant="filled" sx={{ mb: 2 }}>Usuário salvo com sucesso!</Alert>
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
