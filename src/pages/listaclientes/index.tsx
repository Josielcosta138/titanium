import React, { useEffect, useState } from 'react';
import './index.css';
import { apiGet, STATUS_CODE } from '../../api/RestClient';
import { Box, Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [page, setPage] = useState(1); // Estado para controle da página
  const [totalPages, setTotalPages] = useState(1); // Estado para controle do total de páginas

  const carregarClientes = async () => {
    try {
      const response = await apiGet(`/cliente/listarClientes?page=${page}`);
      if (response.status === STATUS_CODE.OK) {
        setClientes(response.data.clientes);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  const handleVerMais = (cliente: any) => {
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

  useEffect(() => {
    carregarClientes();
  }, [page]);

  return (
    <div className="clientes-container">
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
            <li className="active">Clientes</li>
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
            <h2>Clientes</h2>
          </div>
          <div className="top-right">
            <Button variant="contained" color="warning" className="add-client-button">Cadastrar Cliente</Button>
          </div>
        </div>

        {/* Linha Divisória */}
        <hr className="full-line" />

        {/* Filtros e Navegação */}
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
                  <TableCell>CEP</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map(cliente => (
                  <TableRow key={cliente.id}>
                    <TableCell>{cliente.codigo}</TableCell>
                    <TableCell>{cliente.nomeFantasia}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell>{cliente.cep}</TableCell>
                    <TableCell>
                      <Box className="action-buttons">
                        <Button variant="contained" color="info" onClick={() => handleVerMais(cliente)}>Visualizar</Button>
                        <Button variant="contained" color="success">Imprimir</Button>
                        <Button variant="contained" color="warning">Editar</Button>
                        <Button variant="contained" color="error">Excluir</Button>
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
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Box className="modal-box">
            {selectedCliente && (
              <div>
                <Typography variant="h6">Detalhes do Cliente</Typography>
                <Typography><strong>Nome:</strong> {selectedCliente.nomeFantasia}</Typography>
                <Typography><strong>Email:</strong> {selectedCliente.email}</Typography>
                <Typography><strong>Telefone:</strong> {selectedCliente.telefone}</Typography>
                <Typography><strong>CEP:</strong> {selectedCliente.cep}</Typography>
                <Typography><strong>Endereço:</strong> {selectedCliente.endereco}</Typography>
                {/* Adicione outros detalhes conforme necessário */}
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
