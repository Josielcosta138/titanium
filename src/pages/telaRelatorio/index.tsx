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
  Typography,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { imprimirDadosOrdem } from '../../utils/generatePDF';
import { IOrdemServico } from '../../Interface/OS/type';
import Sidebar from '../../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const Relatorios: React.FC = () => {
  const [ordens, setOrdens] = useState<IOrdemServico[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedOrdem, setSelectedOrdem] = useState<IOrdemServico | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const carregarOrdens = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiGet('/ordemServico/carregar');
      if (response.status === STATUS_CODE.OK) {
        setOrdens(response.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Erro ao carregar ordens de serviço:", error);
      setError('Falha ao carregar ordens de serviço.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerMais = (ordem: IOrdemServico) => {
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredOrdens = ordens.filter(ordem =>
    ordem.codReferenciaOs.includes(searchTerm) ||
    ordem.cliente.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relatorio-corte-container">
      <Sidebar />

      <div className="content-container">
        <div className="top-bar">
          <div className="top-left">
            <button className="back-button">
              <i className="fa fa-arrow-left"></i> Voltar
            </button>
            <h2>Relatório de Corte</h2>
          </div>
          <div className="top-right-relatorio">
            <Button variant="contained" color="warning" className="add-relatorio-button">Cadastrar Relatório</Button>
          </div>
        </div>

        <hr className="full-line" />

        <div className="action-bar">
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Pesquisar"
                className="search-bar-listacliente"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && carregarOrdens()}
              />
              <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={carregarOrdens} />
            </div>


            <select className="filter-select">
              <option value="todos">Filtrar</option>
              <option value="pendentes">Pendentes</option>
              <option value="concluidos">Concluídos</option></select>


            <button className="filter-button">
              Filtrar <FontAwesomeIcon icon={faCaretDown} />
            </button>
          </div>
        </div>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <div className="table-container">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código OS</TableCell>
                    <TableCell>Cod-Referência</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Data-entrada</TableCell>
                    <TableCell>Data-entrega</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrdens.map(ordem => (
                    <TableRow key={ordem.id}>
                      <TableCell>{ordem.id}</TableCell>
                      <TableCell>{ordem.codReferenciaOs}</TableCell>
                      <TableCell>
                        <span className={`status-cell ${ordem.status.toLowerCase()}`}>
                          {ordem.status}
                        </span>
                      </TableCell>
                      <TableCell>{ordem.cliente.razaoSocial}</TableCell>
                      <TableCell>{ordem.dataEntrada}</TableCell>
                      <TableCell>{ordem.dataEntrega}</TableCell>
                      <TableCell>
                        <Box className="action-buttons">
                          <Button variant="contained" color="info" onClick={() => handleVerMais(ordem)}>Visualizar</Button>
                          <Button variant="contained" color="success" onClick={() => imprimirDadosOrdem(ordem)}>Imprimir</Button>
                          <Button variant="contained" color="warning" onClick={() => editarOrdem(ordem.id)}>Editar</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="results-info">
              Mostrando {filteredOrdens.length} de {ordens.length} resultados
              <div className="pagination-info">
                <Button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>Anterior</Button>
                {Array.from({ length: totalPages }, (_, p) => (
                  <Button
                    key={p + 1}
                    onClick={() => handlePageChange(p + 1)}
                    className={page === p + 1 ? 'active-page' : ''}
                  >
                    {p + 1}
                  </Button>
                ))}
                <Button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>Próximo</Button>
              </div>
            </div>
          </div>
        )}

        <Modal open={open} onClose={handleClose}>
          <Box className="modal-box">
            {selectedOrdem && (
              <div>
                <Typography variant="h5">Detalhes da Ordem de Serviço</Typography>
                <Typography><strong>Código OS:</strong> {selectedOrdem.id}</Typography>
                <Typography><strong>Data de Entrada:</strong> {selectedOrdem.dataEntrada}</Typography>
                <Typography><strong>Data de Entrega:</strong> {selectedOrdem.dataEntrega}</Typography>
                <Typography><strong>Valor Total:</strong> {selectedOrdem.valorTotal}</Typography>
                <Typography><strong>Cliente:</strong> {selectedOrdem.cliente.razaoSocial}</Typography>
              </div>
            )}
            <Button variant="contained" color="error" onClick={handleClose}>Fechar</Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Relatorios;
