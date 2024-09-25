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

const Relatorios: React.FC = () => {
  const [relatorios, setRelatorios] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRelatorio, setSelectedRelatorio] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const carregarRelatorios = async () => {
    try {
      const response = await apiGet('/relatorios/carregar');
      if (response.status === STATUS_CODE.OK) {
        setRelatorios(response.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
    }
  };

  const handleVerMais = (relatorio: any) => {
    setSelectedRelatorio(relatorio);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRelatorio(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    carregarRelatorios();
  }, [page]);

  const editarRelatorio = (id: number) => {
    navigate(`/relatorio/${id}`);
  };

  const imprimirDadosRelatorio = (relatorio: any) => {
    if (!relatorio) {
      console.error('Nenhum relatório selecionado');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Detalhes do Relatório", 10, 10);
    doc.setFontSize(12);
    doc.text(`Order ID: ${relatorio.id}`, 10, 20);
    doc.text(`Cliente: ${relatorio.cliente}`, 10, 30);
    doc.text(`Referência: ${relatorio.referencia}`, 10, 40);
    doc.text(`Tipo de Tecido: ${relatorio.tipoTecido}`, 10, 50);
    doc.text(`Quantidade de Rola: ${relatorio.quantidadeRola}`, 10, 60);
    doc.text(`Grade: ${relatorio.grade}`, 10, 70);
    doc.text(`Opções de Pré-Corte: ${relatorio.opcoesPreCorte}`, 10, 80);
    doc.text(`Data de Chegada: ${relatorio.dataChegada}`, 10, 90);
    doc.save(`relatorio_${relatorio.id}_dados.pdf`);
  };

  const excluirRelatorio = (id: number) => {
    // Implementar a lógica para excluir o relatório
    console.log(`Excluir relatório com ID: ${id}`);
  };

  return (
    <div className="relatorios-container">
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
            <li className="active">Relatórios</li>
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
            <h2>Relatórios</h2>
          </div>
          <div className="top-right">
            <Button variant="contained" color="warning" className="add-relatorio-button">Gerar Relatório</Button>
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
                  <TableCell>Order ID</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Referência</TableCell>
                  <TableCell>Tipo de Tecido</TableCell>
                  <TableCell>Quantidade de Rola</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Opções de Pré-Corte</TableCell>
                  <TableCell>Data de Chegada</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {relatorios.map(relatorio => (
                  <TableRow key={relatorio.id}>
                    <TableCell>{relatorio.id}</TableCell>
                    <TableCell>{relatorio.cliente}</TableCell>
                    <TableCell>{relatorio.referencia}</TableCell>
                    <TableCell>{relatorio.tipoTecido}</TableCell>
                    <TableCell>{relatorio.quantidadeRola}</TableCell>
                    <TableCell>{relatorio.grade}</TableCell>
                    <TableCell>{relatorio.opcoesPreCorte}</TableCell>
                    <TableCell>{relatorio.dataChegada}</TableCell>
                    <TableCell>
                      <Box className="action-buttons">
                        <Button variant="contained" color="info"
                          onClick={() => handleVerMais(relatorio)}>Visualizar</Button>
                        <Button variant="contained" color="success"
                          onClick={() => imprimirDadosRelatorio(relatorio)}>Imprimir</Button>
                        <Button variant="contained" color="warning"
                          onClick={() => editarRelatorio(relatorio.id)}>Editar</Button>
                        <Button variant="contained" color="error"
                          onClick={() => excluirRelatorio(relatorio.id)}>Excluir</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="results-info">
            Mostrando 1 de {totalPages} de {relatorios.length} resultados
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
            {selectedRelatorio && (
              <div>
                <Typography variant="h6">Detalhes do Relatório</Typography>
                <Typography><strong>Order ID:</strong> {selectedRelatorio.id}</Typography>
                <Typography><strong>Cliente:</strong> {selectedRelatorio.cliente}</Typography>
                <Typography><strong>Referência:</strong> {selectedRelatorio.referencia}</Typography>
                <Typography><strong>Tipo de Tecido:</strong> {selectedRelatorio.tipoTecido}</Typography>
                <Typography><strong>Quantidade de Rola:</strong> {selectedRelatorio.quantidadeRola}</Typography>
                <Typography><strong>Grade:</strong> {selectedRelatorio.grade}</Typography>
                <Typography><strong>Opções de Pré-Corte:</strong> {selectedRelatorio.opcoesPreCorte}</Typography>
                <Typography><strong>Data de Chegada:</strong> {selectedRelatorio.dataChegada}</Typography>
              </div>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Relatorios;
