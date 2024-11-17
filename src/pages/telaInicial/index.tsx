import React, { useState, useEffect } from 'react';
import './index.css';
import { apiGet, STATUS_CODE } from '../../api/RestClient';
import { Alert, Box, Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IClientes } from '../../Interface/Cliente/type';
import jsPDF from 'jspdf';
import { IOrdemServico } from '../../Interface/OS/type';
import Sidebar from '../../components/Sidebar';


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
  const [MAY, setMAY] = useState<any>(null);
  const [NOVEMBER, setNOVEMBER] = useState<any>(null);
  const [DECEMBER, setDECEMBER] = useState<any>(null);
  const [JANUARY, setJANUARY] = useState<any>(null);
  const [FEBRUARY, setFEBRUARY] = useState<any>(null);
  const [MARCH, setMARCH] = useState<any>(null);
  const [APRIL, setAPRIL] = useState<any>(null);
  const [JUNE, setJUNE] = useState<any>(null);
  const [JULY, setJULY] = useState<any>(null);
  const [AUGUST, setAUGUST] = useState<any>(null);
  const [SEPTEMBER, setSEPTEMBER] = useState<any>(null);
  const [OCTOBER, setOCTOBER] = useState<any>(null);

  const [november, setNovember] = useState<any>(null);
  const [december, setDecember] = useState<any>(null);
  const [january, setJanuary] = useState<any>(null);
  const [february, setFebruary] = useState<any>(null);
  const [march, setMarch] = useState<any>(null);
  const [april, setApril] = useState<any>(null);
  const [june, setJune] = useState<any>(null);
  const [july, setJuly] = useState<any>(null);
  const [august, setAugust] = useState<any>(null);
  const [september, setSeptember] = useState<any>(null);
  const [october, setOctober] = useState<any>(null);
  const [may, setMay] = useState<any>(null);



  const [economiaMaterialTotal, seteconomiaMaterialTotal] = useState<any>(null);
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
      const [ordensResponse, clientesResponse, faturamentoResponse, materiaPrimaResponse,
         faturamentoResponseMensal, totalMaterialPorMesResponse] = await Promise.all([
        apiGet('/ordemCorte/carregarTotalDeOrdemCorte'),
        apiGet('/cliente/carregarTotalDeClientes'),
        apiGet('/ordemServico/carregarFaturamentoTotal'),
        apiGet('/materiaprima/carregarEconomiaDeMaterial'),
        apiGet('/ordemServico/carregarFaturamentoMensal'),
        apiGet('/ordemServico/carregarEconomiaDeMaterialPorMes'),
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

            if (materiaPrimaResponse.status === STATUS_CODE.OK) {
              const economiaTotal = materiaPrimaResponse.data;
              seteconomiaMaterialTotal(economiaTotal);        
            }

            if (faturamentoResponseMensal.status === STATUS_CODE.OK) {
              const fatMensal = faturamentoResponseMensal.data;
              
              if (fatMensal.DECEMBER !== undefined) {
                setDECEMBER(fatMensal.DECEMBER);
              }
            
              if (fatMensal.NOVEMBER !== undefined) {
                setNOVEMBER(fatMensal.NOVEMBER);
              }

              if (fatMensal.JANUARY !== undefined) {
                setJANUARY(fatMensal.JANUARY);
              }

              if (fatMensal.FEBRUARY !== undefined) {
                setFEBRUARY(fatMensal.FEBRUARY);
              }

              if (fatMensal.MARCH !== undefined) {
                setMARCH(fatMensal.MARCH);
              }


              if (fatMensal.APRIL !== undefined) {
                setAPRIL(fatMensal.APRIL);
              }


              if (fatMensal.MAY !== undefined) {
                setMAY(fatMensal.MAY);
              }


              if (fatMensal.JUNE !== undefined) {
                setJUNE(fatMensal.JUNE);
              }

              if (fatMensal.JULY !== undefined) {
                setJULY(fatMensal.JULY);
              }

              if (fatMensal.AUGUST !== undefined) {
                setAUGUST(fatMensal.AUGUST);
              }

              if (fatMensal.SEPTEMBER !== undefined) {
                setSEPTEMBER(fatMensal.SEPTEMBER);
              }

              if (fatMensal.OCTOBER !== undefined) {
                setOCTOBER(fatMensal.OCTOBER);
              }
            }


            if (totalMaterialPorMesResponse.status === STATUS_CODE.OK) {
              const matMensal = totalMaterialPorMesResponse.data;
              
              if (matMensal.DECEMBER !== undefined) {
                setDecember(matMensal.DECEMBER);
              }
            
              if (matMensal.NOVEMBER !== undefined) {
                setNovember(matMensal.NOVEMBER);
              }

              if (matMensal.JANUARY !== undefined) {
                setJanuary(matMensal.JANUARY);
              }

              if (matMensal.FEBRUARY !== undefined) {
                setFebruary(matMensal.FEBRUARY);
              }

              if (matMensal.MARCH !== undefined) {
                setMarch(matMensal.MARCH);
              }


              if (matMensal.APRIL !== undefined) {
                setApril(matMensal.APRIL);
              }


              if (matMensal.MAY !== undefined) {
                setMay(matMensal.MAY);
              }


              if (matMensal.JUNE !== undefined) {
                setJune(matMensal.JUNE);
              }

              if (matMensal.JULY !== undefined) {
                setJuly(matMensal.JULY);
              }

              if (matMensal.AUGUST !== undefined) {
                setAugust(matMensal.AUGUST);
              }

              if (matMensal.SEPTEMBER !== undefined) {
                setSeptember(matMensal.SEPTEMBER);
              }

              if (matMensal.OCTOBER !== undefined) {
                setOctober(matMensal.OCTOBER);
              }

            }







    } catch (error) {
      console.error("Erro ao carregar ordens de serviço:", error);
    }


  }



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
    navigate('/ordemServico');
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




  const dataGrafico = [
    { name: "Jan", valores: JANUARY || 0 },
    { name: "Fev", valores: FEBRUARY || 0 },
    { name: "Mar", valores: MARCH || 0 },
    { name: "Abr", valores: APRIL || 0 },
    { name: "Mai", valores: MAY || 0 },
    { name: "Jun", valores: JUNE || 0 },
    { name: "Jul", valores: JULY || 0 },
    { name: "Ago", valores: AUGUST || 0 },
    { name: "Set", valores: SEPTEMBER || 0},
    { name: "Out", valores: OCTOBER || 0},
    { name: "Nov", valores: NOVEMBER || 0},
    { name: "Dez", valores: DECEMBER || 0 },
  ];

  const dataGraficoSobras = [
    { name: "Jan", valores: january || 0 },
    { name: "Fev", valores: february || 0 },
    { name: "Mar", valores: march || 0 },
    { name: "Abr", valores: april || 0 },
    { name: "Mai", valores: may || 0 },
    { name: "Jun", valores: june || 0 },
    { name: "Jul", valores: july || 0 },
    { name: "Ago", valores: august || 0 },
    { name: "Set", valores: september || 0},
    { name: "Out", valores: october || 0},
    { name: "Nov", valores: november || 0},
    { name: "Dez", valores: december || 0 },

  ];


  const App = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px' }}>
        <BasicLineChart />
        <BasicLineChartSobras />
      </div>
    );
  };
  
  const BasicLineChart = () => {
    return (
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ textAlign: 'left', marginLeft: '240px' }}>Faturamento Mensal (R$)</h4>
        <LineChart
          width={600}
          height={400}
          data={dataGrafico}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="valores" stroke="#ea6a00" />
        </LineChart>
      </div>
    );
  };
  
  const BasicLineChartSobras = () => {
    return (
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ textAlign: 'left', marginLeft: '220px' }}>Sobras de materiais Mensal (MT)</h4>
        <LineChart
          width={600}
          height={400}
          data={dataGraficoSobras}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="valores" stroke="#ea6a00" />
        </LineChart>
      </div>
    );
  };
  


  return (
    <div className="container"> <Sidebar></Sidebar>
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
            <span><strong>ECONOMIA DE MATERIAIS (+)</strong></span>
            <h1>{economiaMaterialTotal != null ? economiaMaterialTotal : 'Carregando...'} Metros</h1>
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
        <hr style={{ marginTop: '100px' }} className="full-line" />
        <div className="table-container">
        <Alert severity="warning" className="custom-alert">
            Atenção! Fique atento a Data de entrega da ordem de serviço.
          </Alert>
          <div className="header">
            <h3>Ordens de Serviço - Prioridade por Data de Entrega</h3> 
          </div>
        {/* <div className="header">
        <h3>Ordens de Serviço - Prioridade por Data de Entrega</h3> 
        <div className="top-right">
          <Alert severity="warning">Atenção! Fique atento a Data de entrega da ordem de serviço.</Alert>
        </div> */}
        {/* </div> */}

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
                    ordem.status === 'PENDENTE'
                      ? 'status-pendente'
                      : ordem.status === 'PRODUZINDO'
                      ? 'status-producao'
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

          {/* <hr style={{ marginTop: '100px' }} className="full-line" />          
          <div className="top-right" style={{ right: '20px', zIndex: 1000 }}>
          <h3>Faturamento e Economia Mensal</h3> 
            <Alert severity="info">Atenção! Passe o mouse sobre o gráfico para visualizar os valores!.</Alert>
          </div>
        < App />   */}
        
        <hr style={{ marginTop: '100px' }} className="full-line" />          
          <div className="table-container">
            <Alert severity="info" className="custom-alert">
              Atenção! Passe o mouse sobre o gráfico para visualizar os valores!
            </Alert>
            <div className="header">
              <h3>Faturamento e Economia Mensal</h3> 
            </div>
            <App />  
          </div>
      

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
