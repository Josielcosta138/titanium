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
import jsPDF from 'jspdf';

const ListaOrdemServico: React.FC = () => {
  const [ordens, setOrdens] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedOrdem, setSelectedOrdem] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const carregarOrdens = async () => {
    try {
      const response = await apiGet('/ordensServico/carregar');
      if (response.status === STATUS_CODE.OK) {
        setOrdens(response.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Erro ao carregar ordens de serviço:", error);
    }
  };

  const handleVerMais = (ordem: any) => {
    setSelectedOrdem(ordem);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrdem(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    carregarOrdens();
  }, [page]);

  const editarOrdem = (id: number) => {
    navigate(`/ordemServico/${id}`);
  };

  const imprimirDadosOrdem = (ordem: any) => {
    if (!ordem) {
      console.error('Nenhuma ordem de serviço selecionada');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Detalhes da Ordem de Serviço", 10, 10);
    doc.setFontSize(12);
    doc.text(`Código: ${ordem.id}`, 10, 20);
    doc.text(`Descrição: ${ordem.descricao}`, 10, 30);
    doc.text(`Data: ${ordem.data}`, 10, 40);
    doc.text(`Status: ${ordem.status}`, 10, 50);
    doc.save(`ordem_servico_${ordem.id}_dados.pdf`);
  };

  const excluirOrdem = (id: number) => {
    // Implementar a lógica para excluir a ordem de serviço
    console.log(`Excluir ordem de serviço com ID: ${id}`);
  };

  return (
    <div className="ordem-servico-container">
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
            <li className="active">Ordem de Serviço</li>
            <li>Listagem de Serviços</li>
            <li>Clientes</li>
            <li>Relatórios</li>
            <li>Configurações</li>
          </ul>
        </nav>
      </div>

      <div className="content-container">
        <div className="top-bar">
          <div className="top-left">
            <button className="back-button">
              <i className="fa fa-arrow-left"></i> Voltar
            </button>
            <h2>Ordens de Serviço</h2>
          </div>
          <div className="top-right">
            <Button variant="contained" color="warning" className="add-ordem-button">Cadastrar Ordem</Button>
          </div>
        </div>

        <hr className="full-line" />

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

        <div className="table-container">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordens.map(ordem => (
                  <TableRow key={ordem.id}>
                    <TableCell>{ordem.id}</TableCell>
                    <TableCell>{ordem.descricao}</TableCell>
                    <TableCell>{ordem.data}</TableCell>
                    <TableCell>{ordem.status}</TableCell>
                    <TableCell>
                      <Box className="action-buttons">
                        <Button variant="contained" color="info"
                          onClick={() => handleVerMais(ordem)}>Visualizar</Button>
                        <Button variant="contained" color="success"
                          onClick={() => imprimirDadosOrdem(ordem)}>Imprimir</Button>
                        <Button variant="contained" color="warning"
                          onClick={() => editarOrdem(ordem.id)}>Editar</Button>
                        <Button variant="contained" color="error"
                          onClick={() => excluirOrdem(ordem.id)}>Excluir</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="results-info">
            Mostrando 1 de 6 de {ordens.length} resultados
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

        <Modal open={open} onClose={handleClose}>
          <Box className="modal-box">
            {selectedOrdem && (
              <div>
                <Typography variant="h6">Detalhes da Ordem de Serviço</Typography>
                <Typography><strong>Código:</strong> {selectedOrdem.id}</Typography>
                <Typography><strong>Descrição:</strong> {selectedOrdem.descricao}</Typography>
                <Typography><strong>Data:</strong> {selectedOrdem.data}</Typography>
                <Typography><strong>Status:</strong> {selectedOrdem.status}</Typography>
                <Button onClick={handleClose}>Fechar</Button>
              </div>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default ListaOrdemServico;
