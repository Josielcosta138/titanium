import { faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Menu,
  MenuItem,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IOrdemServico } from '../../Interface/OS/type';
import { apiGet, STATUS_CODE } from '../../api/RestClient';
import Sidebar from '../../components/Sidebar';
import { imprimirDadosOrdem } from '../../utils/generatePDF';
import './index.css';

const Relatorios: React.FC = () => {
  const [ordens, setOrdens] = useState<IOrdemServico[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedOrdem, setSelectedOrdem] = useState<IOrdemServico | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [selectedOrdens, setSelectedOrdens] = useState<IOrdemServico[]>([]);
  const [showFilter, setShowFilter] = useState(false); // Estado para exibir/ocultar filtros
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

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

  const handleVerMais = (ordem: IOrdemServico) => {
    setSelectedOrdem(ordem);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrdem(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    carregarOrdens();
  }, [page, filterStatus]);

  const editarOrdem = (id: number) => {
    navigate(`/ordemServico/${id}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredOrdens = ordens.filter((ordem) =>
    (filterStatus === 'todos' || ordem.status.toLowerCase() === filterStatus) &&
    (ordem.codReferenciaOs.includes(searchTerm) ||
      ordem.cliente.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectOrdem = (ordem: IOrdemServico) => {
    setSelectedOrdens(selectedOrdens.includes(ordem)
      ? selectedOrdens.filter((o) => o !== ordem)
      : [...selectedOrdens, ordem]);
  };

  const handleImprimirSelecionados = () => {
    selectedOrdens.forEach(imprimirDadosOrdem);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className="relatorio-corte-container">
      <Sidebar />

      <div className="content-container">
        <div className="top-bar">
          <div className="top-left">
            <button className="back-button">
              <i className="fa fa-arrow-left"></i><FaArrowLeft /> Voltar
            </button>
            <h2>Relatório de Corte</h2>
          </div>
          <div className="top-right-relatorio">
            <Button
              variant="contained"
              color="success"
              className="imprimir-selecionados-button"
              onClick={handleImprimirSelecionados}
              disabled={selectedOrdens.length === 0}
            >
              Imprimir Selecionados
            </Button>
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
                onKeyDown={(e) => e.key === 'Enter' && carregarOrdens()} // mantém a pesquisa com Enter
              />
              <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={carregarOrdens} />
            </div>


            <Button className="filter-button" onClick={handleMenuClick}>
              Filtrar <FontAwesomeIcon icon={faCaretDown} />
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
            >

              <MenuItem onClick={handleMenuClose}>
                <label>
                Código OS
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <label>
                  Cliente
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <label>
                Referência
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <label>
                  Modelo
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <label>
                  Tipo de Tecido
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <label>
                  Data-Entrada
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <label>
                  Data-Saída
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <label>
                  Quantidade de Rolos
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <label>
                Quantidade de Falhas
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <label>
                Quantidade de Sobras
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <label>
                  Valor por Peças
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <label>
                  Quantidade de Peças
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <label>
                  Valor Total
                </label>
              </MenuItem>
            </Menu>
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
                    <TableCell>Selecionar</TableCell>
                    <TableCell>Código OS</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Referência</TableCell>
                    <TableCell>Modelo</TableCell>
                    <TableCell>Tipo de Tecido</TableCell>
                    <TableCell>Data-Entrada</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrdens.map((ordem) => (
                    <TableRow key={ordem.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedOrdens.includes(ordem)}
                          onChange={() => handleSelectOrdem(ordem)}
                        />
                      </TableCell>
                      <TableCell>{ordem.id}</TableCell>
                      <TableCell>{ordem.codReferenciaOs}</TableCell>
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
                    key={p}
                    color={page === p + 1 ? 'primary' : 'inherit'}
                    onClick={() => handlePageChange(p + 1)}
                  >
                    {p + 1}
                  </Button>
                ))}
                <Button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>Próxima</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal open={open} onClose={handleClose}>
        <div className="modal-content">
          {selectedOrdem && (
            <div>
              <Typography variant="h5">Detalhes da Ordem</Typography>
              <Typography>ID: {selectedOrdem.id}</Typography>
              <Typography>Código OS: {selectedOrdem.codReferenciaOs}</Typography>
              <Typography>Cliente: {selectedOrdem.cliente.razaoSocial}</Typography>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Relatorios;

