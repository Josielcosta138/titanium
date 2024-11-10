import React, { useEffect, useState } from 'react';
import './index.css';
import { apiGet, apiPut, STATUS_CODE } from '../../api/RestClient';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import { imprimirDadosOrdem } from '../../utils/generatePDF';
import { IOrdemServico } from '../../Interface/OS/type';
import { IOrdemCorte } from '../../Interface/OrdemCorte/type';
import { IEnderecos } from '../../Interface/EnderecoCliente/type';
import OrdemCorte from '../ordemCorte';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import Sidebar from '../../components/Sidebar';
import { FaArrowLeft } from 'react-icons/fa';

const ListaOrdemServico: React.FC = () => {
  const [ordens, setOrdens] = useState<IOrdemServico[]>([]);
  const [open, setOpen] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [selectedOrdem, setSelectedOrdem] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [ordenTeste, setOrdemTeste] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<string>(''); 
  const [botoesDesabilitados, setBotoesDesabilitados] = useState(false);
  const [nomePesquisar, setNomePesquisar] = useState<string>('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);



  const carregarOrdens = async () => {
    try {
      const response = await apiGet('/ordemServico/carregar');
      if (response.status === STATUS_CODE.OK) {
        setOrdens(response.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Erro ao carregar ordens de serviço:", error);
    }
  };



  const carregarOrdensPorNome = async () => {
    try {

      if (!nomePesquisar) {
        carregarOrdens();
      }else{
        const response = await apiGet(`ordemServico/carregarNome/${nomePesquisar}`);
        if (response.status === STATUS_CODE.OK) {
          setOrdens(response.data);
          setTotalPages(response.data.totalPages);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar ordens de serviço:", error);
    }
  }



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


  const rederionarCadastroOrdemCorte = async (idOc : number) => {
    localStorage.setItem("statusOC", 'PRODUZINDO');
    localStorage.setItem("ordemServicoId", idOc.toString());
    navigate('/ordemCorte')
  };


  useEffect(() => {
    carregarOrdens();
  }, [page]);



  const editarOrdem = (id: number) => {
    localStorage.setItem('idOS', id.toString());

    const ordemAtual = ordens.find(ordem => ordem.id === id);
    if (ordemAtual) {
        localStorage.setItem('statusAtual', ordemAtual.status);
    }    
    navigate(`/ordemServico/${id}`);
  };



  
  const atualizarStatusDaOs = async (id: number) => {
    const data = {
        status: "FINALIZADA",
    };

    try {
        const response = await apiPut(`ordemServico/atualizarStatusOs/${id}`, data);
  
        if (response.status === STATUS_CODE.OK) {          
          enviarEmailCliente(id);
        }
      } catch (error) {
        console.error("Erro ao salvar ordem de serviço:", error);
      }
  }


  const enviarEmailCliente = async (id: number) => { 
    setIsLoading(true); 
    const data = {};
  
    try {
      const response = await apiPut(`ordemServico/enviarEmail/${id}`, data);
      if (response.status === STATUS_CODE.OK) {
        console.log("E-mail enviado. ");    
      }

      setTimeout(() => {
        setOpenEmail(true);
        setTimeout(() => setOpenEmail(false), 5000);
      }, 1000); 

      
    } catch (error) {
      console.error("Erro ao enviar e-mail: ", error);
    } finally {
      setIsLoading(false);
      carregarOrdens();
    }
  };

  
  const redirecionarCadastroOS = () => {
    navigate('/ordemServico')
  }



  const redirecionarTelaInicial = () => {
    navigate('/telaInicial')
  }


  return (
    <div className="ordem-servico-container">
      <Sidebar></Sidebar>
      <div className="content-container">
        <div className="top-bar">
          <div className="top-left">
            <button 
              className="back-button"
              onClick={redirecionarTelaInicial}
              >
              <FaArrowLeft />Voltar
            </button>
            <h2>Ordens de Serviço</h2>
          </div>
          <div className="top-right">
            <Button onClick={redirecionarCadastroOS} variant="contained" color="warning" className="add-ordem-button-os">Cadastrar OS</Button>
          </div>
        </div>
        <hr className="full-line" />
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <CircularProgress />
            <Typography variant="body1" style={{ marginTop: 10 }}>
              Enviando e-mail ao cliente...
            </Typography>
          </div>
        )}

        <div className="action-bar">
          <div className="search-filter-container">
            <input 
              type="text" 
              placeholder="Pesquisar por cliente..." 
              className="search-bar-lista-serviço" 
              value={nomePesquisar}
              onChange={(event) => setNomePesquisar(event.target.value)}
            />
            <button 
              onClick={carregarOrdensPorNome} 
              className="filter-button">Pesquisar <i 
              className="fa fa-caret-down">
              </i></button>
          </div>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, p) => (
              <Button
                key={p + 1}
                onClick={() => handlePageChange(p + 1)}
                className={page === p + 1 ? 'active-page' : ''}
              >
                {p + 1}
              </Button>
            ))}
          </div>
        </div>

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
                {ordens.map(ordem => (
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
                    <TableCell>{ordem.dataEntrada}</TableCell>
                    <TableCell>{ordem.dataEntrega}</TableCell>
                    <TableCell>
                      <Box className="action-buttons">
                        <Button 
                          variant="contained" color="info"
                          onClick={() => handleVerMais(ordem)}
                          >Visualizar
                        </Button>
                        <Button 
                          variant="contained" color='secondary'
                          onClick={() => rederionarCadastroOrdemCorte(ordem.id)} 
                          disabled={ordem.status === 'FINALIZADA'} 
                          >Ordem de Corte
                        </Button>
                        <Button 
                          variant="contained" color="warning"
                          onClick={() => editarOrdem(ordem.id)} 
                          disabled={ordem.status === 'FINALIZADA'} 
                          >Editar
                        </Button>
                        <Button 
                          variant="contained" color="success"
                          onClick={() => atualizarStatusDaOs(ordem.id)} 
                          disabled={ordem.status === 'FINALIZADA'} 
                          >Finalizar
                        </Button>
                        <Modal open={openEmail} onClose={() => setOpenEmail(false)}>
                            <Box className="alert-box" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
                              <Alert variant="filled" sx={{ mb: 4 }}>
                              E-mail enviado com sucesso! O cliente foi notificado sobre a conclusão da Ordem de Serviço.
                        </Alert>
                        </Box>
                        </Modal>          
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
             <Typography variant="h5" sx={{textAlign: 'center'}}>Detalhes da Ordem de Serviço</Typography>
             <Typography><strong>Código OS:</strong> {selectedOrdem.id}</Typography>
             <Typography><strong>Quantidade de Rolos:</strong> {selectedOrdem.qtdeRolos}</Typography>
             <Typography><strong>Data de Entrada:</strong> {selectedOrdem.dataEntrada}</Typography>
             <Typography><strong>Data de Entrega:</strong> {selectedOrdem.dataEntrega}</Typography>
             <Typography><strong>Quantidade de Peças:</strong> {selectedOrdem.qtdePecas}</Typography>
             <Typography><strong>Valor por Peça:</strong> {selectedOrdem.valorPorPeca}</Typography>
             <Typography><strong>Valor Total:</strong> {selectedOrdem.valorTotal}</Typography>
             <Typography><strong>Código de Referência:</strong> {selectedOrdem.codReferenciaOs}</Typography>
             <Typography><strong>Modelo:</strong> {selectedOrdem.modelo}</Typography>
             <Typography><strong>Número da Nota Fiscal:</strong> {selectedOrdem.numeorNotaFiscal}</Typography>
             <Typography><strong>Observações:</strong> {selectedOrdem.campoObservacao}</Typography>
             <Typography><strong>Status:</strong> {selectedOrdem.status}</Typography>
             <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', display: 'block', marginTop: '16px' }}>
                <span style={{ display: 'block', borderBottom: '1px solid #000', width: '100%' }}></span>
              </Typography>
             <Typography variant="h6" sx={{textAlign: 'center'}}>Dados do Cliente</Typography>
             <Typography><strong>Código do Cliente:</strong> {selectedOrdem.cliente.id}</Typography>
             <Typography><strong>Razão Social:</strong> {selectedOrdem.cliente.razaoSocial}</Typography>
             <Typography><strong>Nome Fantasia:</strong> {selectedOrdem.cliente.nomeFantasia}</Typography>
             <Typography><strong>Email:</strong> {selectedOrdem.cliente.email}</Typography>
             <Typography><strong>Telefone:</strong> {selectedOrdem.cliente.telefone}</Typography>
             <Typography><strong>CNPJ:</strong> {selectedOrdem.cliente.cnpj}</Typography>
             <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', display: 'block', marginTop: '16px' }}>
                <span style={{ display: 'block', borderBottom: '1px solid #000', width: '100%' }}></span>
             </Typography>



             {selectedOrdem.enderecosCliemte && selectedOrdem.enderecosCliemte.length > 0 && (
            <div>
              <Typography variant="h6" sx={{textAlign: 'center'}}>Endereços do Cliente</Typography>
              {selectedOrdem.enderecosCliemte.map((endereco: IEnderecos, index: number) => (
                <div key={index}>
                  <Typography><strong>Código do endereço:</strong> {endereco.id}</Typography>
                  <Typography><strong>Rua:</strong> {endereco.rua}</Typography>
                  <Typography><strong>Bairro:</strong> {endereco.bairro}</Typography>
                  {endereco.cidadeResponseDomList.map((cidadeInfo, cidadeIndex) => (
                    <div key={cidadeIndex}>
                      <Typography><strong>Cidade:</strong> {cidadeInfo.cidade.name}</Typography>
                      <Typography><strong>Estado:</strong> {cidadeInfo.cidade.uf}</Typography>
                    </div>
                  ))}
                  <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', display: 'block', marginTop: '16px' }}>
                      <span style={{ display: 'block', borderBottom: '1px solid #000', width: '100%' }}></span>
                  </Typography>
                </div>
              ))}
            </div>
            )}

             {selectedOrdem.ordensDeCorte && selectedOrdem.ordensDeCorte.length > 0 && (
               <div>
                 <Typography variant="h6" sx={{textAlign: 'center'}}>Materiais Usados na Ordem de Corte</Typography>
                 {selectedOrdem.ordensDeCorte.map((ordemCorte: IOrdemCorte, index: number) => (
                    <div key={index}>
            <Typography><strong>Código Ordem de corte:</strong> {ordemCorte.id}</Typography>
            <Typography><strong>Nome da Matéria-Prima:</strong> {ordemCorte.materiaPrima.nome}</Typography>
            <Typography><strong>Comprimento:</strong> {ordemCorte.materiaPrima.comprimento}</Typography>
            <Typography><strong>Quantidade de rolos:</strong> {ordemCorte.materiaPrima.qtde}</Typography>
            <Typography><strong>Largura:</strong> {ordemCorte.materiaPrima.largura}</Typography>
            <Typography><strong>Código de Referência:</strong> {ordemCorte.materiaPrima.codReferencia}</Typography>
            <Typography><strong>Sobras:</strong> {ordemCorte.materiaPrima.qtdeMaterialRestante}</Typography>
            <Typography><strong>Falhas:</strong> {ordemCorte.materiaPrima.qtdeMaterialFalhas}</Typography>
            <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', display: 'block', marginTop: '16px' }}>
                <span style={{ display: 'block', borderBottom: '1px solid #000', width: '100%' }}></span>
            </Typography>
            </div>
            ))}

               </div>
             )}
           
           <Box sx={{ display: 'flex', justifyContent: 'flex', gap: '16px', mt: 2 }}>
              <Button 
                onClick={handleClose}
                variant="contained"
                color="primary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                Fechar
              </Button>

              <Button 
                onClick={() => imprimirDadosOrdem(selectedOrdem)}
                variant="contained"
                color="primary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                Imprimir 
                <LocalPrintshopIcon 
                  sx={{ color: 'white', fontSize: '1.89rem', marginLeft: '8px' }} 
                />
              </Button>
            </Box>
           </div>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default ListaOrdemServico;
