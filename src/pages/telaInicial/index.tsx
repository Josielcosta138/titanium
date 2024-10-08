import React, { useState, useEffect } from 'react';
import './index.css';
import { apiGet, STATUS_CODE } from '../../api/RestClient';
import { Alert, Box, Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IClientes } from '../../Interface/Cliente/type';
import jsPDF from 'jspdf';
import { IOrdemServico } from '../../Interface/OS/type';



const TelaInicial: React.FC = () => {
 
  const [ordens, setOrdens] = useState<IOrdemServico[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedOrdem, setSelectedOrdem] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [ordenTeste, setOrdemTeste] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<string>(''); 
  const [botoesDesabilitados, setBotoesDesabilitados] = useState(false);
  const [clientes, setClientes] = useState<IClientes[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [valorTotalCortesGerados, setValorTotalCortesGerados] = useState<any>(null);
  const [totalClientes, setTotalClientes] = useState<any>(null);
  const [faturamentoTotal, setFaturamentoTotal] = useState<any>(null);
  const navigate = useNavigate(); 

  const carregarOrdensDeServico = async () => {
    try {
      carregarToolTips();

      const response = await apiGet('/ordemServico/carregar');
      if (response.status === STATUS_CODE.OK) {

        const ordensCarregadas = response.data;

        const ordensOrdenadas = ordensCarregadas.sort((a: IOrdemServico, b: IOrdemServico) => {
        const dataEntregaA = new Date(a.dataEntrega).getTime();
        const dataEntregaB = new Date(b.dataEntrega).getTime();
        return dataEntregaA - dataEntregaB;
        });

        setOrdens(ordensOrdenadas);
        setTotalPages(response.data.totalPages);        
      }
    } catch (error) {
      console.error("Erro ao carregar ordens de serviço:", error);
    }
  };


  const carregarToolTips = async () => {
    try {
      const [ordensResponse, clientesResponse, faturamentoResponse] = await Promise.all([
        apiGet('/ordemCorte/carregarTotalDeOrdemCorte'),
        apiGet('/cliente/carregarTotalDeClientes'),
        apiGet('/ordemServico/carregarFaturamentoTotal'),
      ]);
            if (ordensResponse.status === STATUS_CODE.OK) {

              const ordensCorte = ordensResponse.data;
              setValorTotalCortesGerados(ordensCorte);        
            }
          
            if (clientesResponse.status === STATUS_CODE.OK) {
              const clientesTotais = clientesResponse.data;
              setTotalClientes(clientesTotais);        
            }

            if (faturamentoResponse.status === STATUS_CODE.OK) {
              const faturamentoTotal = faturamentoResponse.data;
              setFaturamentoTotal(faturamentoTotal);        
            }



    } catch (error) {
      console.error("Erro ao carregar ordens de serviço:", error);
    }


  }





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

  useEffect(() => {
    carregarOrdensDeServico();
  }, [page]);

  

  const formatarDataCorreta = (data: string): string => {
    const dataSemFuso = new Date(data + 'T00:00:00'); 
    return dataSemFuso.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); 
  };
  

  const corDeUrgenciaDeEntrega = (index: number, total: number) => {
    const startColor = [255, 81, 29]; 
    const endColor = [173, 216, 230]; 
  
    const ratio = index / total;
  
    const r = Math.round(startColor[0] + ratio * (endColor[0] - startColor[0]));
    const g = Math.round(startColor[1] + ratio * (endColor[1] - startColor[1]));
    const b = Math.round(startColor[2] + ratio * (endColor[2] - startColor[2]));
  
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  const redirecionarCadastroOs = () => {
    navigate('/ordemCliente');
  }

  const redirecionarParaListaDeOs = () => {
    navigate('/listaServico');
  }

  const redirecionarListaDeClientes = () => {
    navigate('/listaCliente');
  }

  const redirecionarRelatorios = () => {
    navigate('/relatorios');
  }

  const redirecionarCadastroDeClientes = () => {
    navigate('/ordemCliente/');
  }

  return (
    <div className="container">
      <aside className="sidebar">
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
            <li onClick={redirecionarCadastroDeClientes}>Cadastro de Cliente</li>
            <li onClick={redirecionarCadastroOs}>Ordem de Serviço</li>
            <li onClick={redirecionarParaListaDeOs}>Listagem de Serviços</li>
            <li onClick={redirecionarListaDeClientes}>Clientes</li>
            <li onClick={redirecionarRelatorios}>Relatórios</li>
            <li>Configurações</li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <div className="dashboard">
          <div className="card blue">
          <span><strong>CORTES GERADOS</strong></span>
            <h1>{valorTotalCortesGerados != null ? valorTotalCortesGerados : 'Carregando...'}</h1>
          </div>
          <div className="card gray">
            <span><strong>CLIENTES CADASTRADOS</strong></span>
            <h1>{totalClientes != null ? totalClientes : 'Carregando...' }</h1>
          </div>
          <div className="card orange">
            <span><strong>FATURAMENTO TOTAL</strong></span>
            <h1>{faturamentoTotal != null 
              ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturamentoTotal)
              : 'Carregando...'}</h1>
          </div>
          <div className="card orange-light">
            <span>USUÁRIOS CADASTRADOS</span>
            <h1>3</h1>
          </div>
        </div>
        <div className="button-container">
          <button onClick={() => {redirecionarCadastroOs()}}>Ordem de Serviço</button>
          <button 
            style={{ backgroundColor: '#388b54', color: '#fff' }}  
            onClick={() => {redirecionarParaListaDeOs()}}>
              Lista de Serviço
          </button>
          <button 
            style={{ backgroundColor: '#ea6a00', color: '#fff' }}
            onClick={() => {redirecionarListaDeClientes()}}>
              Clientes
          </button>
          <button 
            style={{ backgroundColor: '#ffc107', color: '#fff' }}
            onClick={() => {redirecionarRelatorios()}}>
              Relatórios
          </button>
        </div>
        <hr className="full-line" />
        <div className="table-container">
        <div className="header">
        <h3>Ordens de Serviço - Prioridade por Data de Entrega</h3> 
        <div className="top-right">
          <Alert severity="warning">Atenção! Fique atento a Data de entrega da ordem de serviço.</Alert>
        </div>
        </div>

          <TableContainer>
            <Table className='header-table'>
              <TableHead>
                <TableRow>
                  <TableCell>Código OS</TableCell>
                  <TableCell>Cod-Referência</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Data-entrada</TableCell>
                  <TableCell><strong>Data-entrega</strong></TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
          {ordens.map((ordem, index) => (
            <TableRow key={ordem.id}>
              <TableCell>{ordem.id}</TableCell>
              <TableCell>{ordem.codReferenciaOs}</TableCell>
              <TableCell>
                <span
                  className={`status-cell ${
                    ordem.status === 'INICIADA'
                      ? 'status-iniciada'
                      : ordem.status === 'PENDENTE'
                      ? 'status-pendente'
                      : ordem.status === 'FINALIZADA'
                      ? 'status-finalizada'
                      : ''
                  }`}
                >
                  {ordem.status}
                </span>
              </TableCell>
              <TableCell>{ordem.cliente.razaoSocial}</TableCell>
              <TableCell>{formatarDataCorreta(ordem.dataEntrada)}</TableCell>
              <TableCell style={{ backgroundColor: corDeUrgenciaDeEntrega(index, ordens.length), fontWeight:'bold' }}>
                {formatarDataCorreta(ordem.dataEntrega)}
              </TableCell>
              <TableCell>
                <Box className="action-buttons">
                  <Button onClick={redirecionarParaListaDeOs} variant="contained" color="info">
                    Visualizar
                  </Button>
                  
                </Box>
              </TableCell>
            </TableRow>
            ))}
        </TableBody>

            </Table>
          </TableContainer>



          <div className="pagination">
            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>&lt;</Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button key={index} onClick={() => handlePageChange(index + 1)} className={page === index + 1 ? 'active' : ''}>
                {index + 1}
              </Button>
            ))}
            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>&gt;</Button>
          </div>
        </div>      
      </main>
    </div>
  );
};

export default TelaInicial; 
