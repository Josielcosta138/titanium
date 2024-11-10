import React, { useEffect, useState } from 'react';
import './index.css';
import { apiGet, STATUS_CODE } from '../../api/RestClient';
import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IClientes } from '../../Interface/Cliente/type';
import jsPDF from 'jspdf';
import { FaArrowLeft } from 'react-icons/fa'; 
import { faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sidebar from '../../components/Sidebar';
import { IOrdemServico } from '../../Interface/OS/type';

const Clientes: React.FC = () => {
  const [ordens, setOrdens] = useState<IOrdemServico[]>([]);
  const [clientes, setClientes] = useState<IClientes[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1); // Estado para controle da página
  const [totalPages, setTotalPages] = useState(1);   // Estado para controle do total de páginas
  const [nomePesquisar, setNomePesquisar] = useState(''); // Estado para o campo de pesquisa
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarClientes = async () => {
    try {
      const response = await apiGet(`endereco/carregar`);
      if (response.status === STATUS_CODE.OK) {

        setClientes(response.data);
        setTotalPages(response.data.totalPages);
      }

    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  const carregarOrdens = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet('/ordemServico/carregar');
      if (response.status === STATUS_CODE.OK) {
        const data = response.data;
        setOrdens(data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      setError('Falha ao carregar ordens de serviço.');
    } finally {
      setLoading(false);
    }
  };

  const carregarClientesPorNome = async (nome: string) => {
    try {
      const response = await apiGet(`endereco/carregar?nome=${nome}`);
      if (response.status === STATUS_CODE.OK) {
        setClientes(response.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  const handleVerMais = (cliente: IClientes) => {
    setSelectedCliente(cliente);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCliente(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // useEffect(() => {
  //   carregarClientes();
  // }, [page]);


  const editarCliente = (id: number) => {
    navigate(`/ordemCliente/${id}`);
  }


  const imprimirDadosCliente = (cliente: IClientes) => {
    if (!cliente) {
      console.error('Nenhum cliente selecionado');
      return;
    }


    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Detalhes do Cliente", 10, 10);
    doc.setFontSize(12);
    doc.text(`Nome: ${cliente.client?.nomeFantasia || ''}`, 10, 20);
    doc.text(`Email: ${cliente.client?.email || ''}`, 10, 30);
    doc.text(`Telefone: ${cliente.client?.telefone || ''}`, 10, 40);
    doc.text(`Cidade: ${cliente.cidades?.name || ''}`, 10, 50);
    doc.text(`Endereço: ${cliente.rua || ''}, ${cliente.bairro || ''}`, 10, 60);

    doc.save(`${cliente.client?.nomeFantasia}_dados_cliente.pdf`);

  }


  const redirecionarCadastroClientes = () => {
    navigate('/ordemCliente')
  }

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNomePesquisar(e.target.value);
  //   if (e.target.value === '') {
  //     carregarClientes();
  //   } else {
  //     carregarClientesPorNome(e.target.value);
  //   }
  // };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomePesquisar(e.target.value);
    if (e.target.value.trim() === '') {
      // Caso o campo esteja vazio, exibe todos os clientes novamente
      carregarClientes();  // Chama a função para carregar todos os clientes
    } else {
      // Caso contrário, filtra os clientes pelo nome
      carregarClientesPorNome(e.target.value);
    }
  };
  

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      carregarClientesPorNome(nomePesquisar);
    }
  };

  const handleSearchIconClick = () => {
    if (nomePesquisar.trim() === '') {
      carregarClientes();  // Se a pesquisa estiver vazia, carrega todos os clientes
    } else {
      carregarClientesPorNome(nomePesquisar);  // Caso contrário, filtra os clientes pelo nome
    }
  };
  

  // useEffect(() => {
  //   carregarClientes();
  // }, [page]);

  useEffect(() => {
    if (nomePesquisar.trim() === '') {
      carregarClientes();  // Carrega todos os clientes
    } else {
      carregarClientesPorNome(nomePesquisar);  // Filtra clientes por nome
    }
  }, [page, nomePesquisar]);  // Isso garante que a lista seja recarregada corretamente
  

  return (
    <div className="clientes-container">
      <Sidebar></Sidebar>

      {/* <div className="sidebar">
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
            <li className="active">Clientes</li>
            <li>Relatórios</li>
            <li>Configurações</li>
          </ul>
        </nav>
      </div> */}

      <div className="content-container">
        {/* Barra Superior */}
        <div className="top-bar">
          <div className="top-left">
            <button onClick={() => navigate('/telaInicial')} className="back-button">
              <FaArrowLeft />Voltar
            </button>
            <h2>Lista de Clientes</h2>
          </div>
          <div className="top-right">
            <Button onClick={redirecionarCadastroClientes} variant="contained" color="warning" className="add-client-button">Cadastrar Cliente</Button>
          </div>
        </div>

        {/* Linha Divisória */}
        <hr className="full-line" />

        {/* Filtros e Navegação
        <div className="action-bar">
          <div className="search-filter-container">
            <input type="text" placeholder="Pesquisar..." className="search-bar" />
            <button className="filter-button">Filtrar <i className="fa fa-caret-down"></i></button>
          </div>
          <div className="pagination">
            <Button 
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Anterior
            </Button>
            {Array.from({ length: totalPages }, (_, p) => (
              <Button
                key={p + 1}
                onClick={() => handlePageChange(p + 1)}
                className={page === p + 1 ? 'active-page' : ''}
              >
                {p + 1}
              </Button>
            ))}
            <Button 
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Próximo
            </Button>
          </div>
        </div> */}


        {/* Filtros e Navegação */}
        {/* <div className="action-bar">
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <input 
              type="text" 
              placeholder="Digite seu Cliente" 
              className="search-bar-listacliente" 
              value={nomePesquisar}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              />
              <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={handleSearchIconClick} />
            </div> */}
            
            {/* <div className="action-bar-relatorio">
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Pesquisar"
                className="search-bar-listacliente"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && carregarClientes()} // mantém a pesquisa com Enter
              />
              <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={carregarClientes} />
            </div>

          </div>
        </div> */}


<div className="action-bar-relatorio">
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Pesquisar"
                className="search-bar-listacliente"
                value={nomePesquisar}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyPress} // mantém a pesquisa com Enter
              />
              <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={handleSearchIconClick} />
            </div>
          </div>
        </div>

        {/* Tabela de Clientes */}
        <div className="table-container">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Cidade</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map(cliente => (
                  <TableRow key={cliente.id}>
                    <TableCell>{cliente.id}</TableCell>
                    <TableCell>{cliente.client.nomeFantasia}</TableCell>
                    <TableCell>{cliente.client.email}</TableCell>
                    <TableCell>{cliente.client.telefone}</TableCell>
                    <TableCell>{cliente.cidades.name}</TableCell>
                    <TableCell>
                      <Box className="action-buttons-cliente">
                        <Button variant="contained" color="info"
                          onClick={() => handleVerMais(cliente)}>Visualizar</Button>
                        <Button variant="contained" color="success"
                          onClick={() => imprimirDadosCliente(cliente)}>Imprimir</Button>
                        <Button variant="contained" color="warning"
                          onClick={() => editarCliente(cliente.id)}>Editar</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="results-info">
            Mostrando 1 de 6 de {clientes.length} resultados
            <div className="pagination-info">
              <Button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Anterior
              </Button>
              {Array.from({ length: totalPages }, (_, p) => (
                <Button
                  key={p + 1}
                  onClick={() => handlePageChange(p + 1)}
                  className={page === p + 1 ? 'active-page' : ''}
                >
                  {p + 1}
                </Button>
              ))}
              <Button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Próximo
              </Button>
            </div>
          </div>
        </div>

        {/* Modal de Detalhes do Cliente */}
        <Modal open={open} onClose={handleClose}>
          <Box className="modal-box">
            {selectedCliente && (
              <div>
                <Typography variant="h6">Detalhes do Cliente</Typography>
                <Typography><strong>Nome:</strong> {selectedCliente.client?.nomeFantasia}</Typography>
                <Typography><strong>Email:</strong> {selectedCliente.client?.email}</Typography>
                <Typography><strong>Telefone:</strong> {selectedCliente.client?.telefone}</Typography>
                <Typography><strong>Cidade:</strong> {selectedCliente.cidades?.name}</Typography>
                <Typography><strong>Endereço:</strong> {selectedCliente.rua}, {selectedCliente.bairro}</Typography>
                {/* <Typography><strong>Ordens de serviço:</strong> {selectedCliente.client?.ordensServico.length > 0 
          ? selectedCliente.client.ordensServico.join(', ') 
          : 'Nenhuma ordem de serviço no momento.'}</Typography> */}
                <Button onClick={handleClose}>Fechar</Button>
              </div>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Clientes;

