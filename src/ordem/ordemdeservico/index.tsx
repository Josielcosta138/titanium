import React, { useEffect, useState } from 'react';
import './index.css';
import { apiGet, apiPost, apiPut, STATUS_CODE } from '../../api/RestClient';
import { Alert, Box, Modal,  TextField, Button, Select, MenuItem, FormControl, Checkbox, FormControlLabel, Tooltip, AlertTitle } from '@mui/material';
import { IClientes } from '../../Interface/Cliente/type';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Navigate, useNavigate } from 'react-router-dom';
import ConfirmarOC from '../../components/ModelConfirmacaoOC';
import { format, formatDate, parse, parseISO  } from "date-fns";
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import DescriptionIcon from '@mui/icons-material/Description';
import Sidebar from '../../components/Sidebar';




const CadastroOrdemServico: React.FC = () => {
  const [clienteId, setClienteId] = useState<number | ''>(''); 
  const [codReferenciaOs, setCodReferenciaOs] = useState<string>(''); 
  const [modelo, setModelo] = useState<string>('');
  const [quantidadeRolo, setQuantidadeRolo] = useState<number | ''>(0); 
  const [quantidadePecas, setQuantidadePecas] = useState<number | ''>(0);
  const [quantidadeFalhas, setQuantidadeFalhas] = useState<number | ''>(0);
  const [quantidadeSobras, setQuantidadeSobras] = useState<number | ''>(0); 
  const [valorPecas, setValorPecas] = useState<number | ''>();
  const [valorTotal, setValorTotal] = useState<number | ''>('');
  const [notaFiscal, setNotaFiscal] = useState<number | ''>(0); 
  const dataAtual = new Date().toISOString().split('T')[0];
  const [dataEntrada, setdataEntrada] = useState<string>(dataAtual); 
  const [dataEntrega, setdataEntrega] = useState<string>(dataAtual); 
  const [observacao, setObservacao] = useState<string>('');
  const [status, setStatus] = useState<string>(''); 
  const [statusAtt, setStatusAtt] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [clientes, setClientes] = useState<IClientes[]>([]);
  const [ordemServicoId, setordemServicoId] = useState<number>();
  const [openConfirmarOC, setOpenConfirmarOC] = useState(false);
  const navigate = useNavigate();
  const [alertaErro, setAlertaErro] = useState(false);

  

  useEffect(() => {
    const idOS = localStorage.getItem('idOS');
    if (idOS) {
      carregarDadosOrdemServico(Number(idOS));
    }
  }, []);



  const carregarDadosOrdemServico = async (id: number) => {

    try {
      const respondeOS = await apiGet(`ordemServico/carregar/${id}`);
      const dadosDaOs = respondeOS.data;

      const formatData = (inputDate: string) => {
        const date = parseISO(inputDate);
        return format(date, 'dd/MM/yyyy');
      };
    
        setQuantidadeRolo(dadosDaOs.qtdeRolos || 0);
        setdataEntrada(dadosDaOs.dataEntrada ? formatData(dadosDaOs.dataEntrada) : "");
        setdataEntrega(dadosDaOs.dataEntrega ? formatData(dadosDaOs.dataEntrega) : "");
        setQuantidadePecas(dadosDaOs.qtdePecas || 0);
        setQuantidadeFalhas(dadosDaOs.qtdeMaterialFalhas || 0.0);
        setQuantidadeSobras(dadosDaOs.qtdeMaterialRestante || 0.0);
        setValorPecas(dadosDaOs.valorPorPeca || 0.0);
        setValorTotal(dadosDaOs.valorTotal || 0.0);
        setCodReferenciaOs(dadosDaOs.codReferenciaOs || "");
        setModelo(dadosDaOs.modelo || "");
        setNotaFiscal(dadosDaOs.numeorNotaFiscal || 0);
        setObservacao(dadosDaOs.campoObservacao || "");
        setStatus(dadosDaOs.status || "");
        setClienteId(dadosDaOs.cliente.id || 0);

    } catch (error) {
      console.error("Erro ao carregar dados do cliente e endereços:", error);
    }


  }

  const validarCamposObrigatorios = async () => {
    
    if (
      !clienteId ||
      !codReferenciaOs ||
      !modelo ||
      !quantidadeRolo ||
      !dataEntrada ||
      !dataEntrega ||
      !quantidadePecas ||
      !valorPecas ||
      !valorTotal
    ) { 
      setAlertaErro(true);  
      setTimeout(() => {
        setAlertaErro(false);
      }, 8000);   

      return false;
    }
    setAlertaErro(false);
    validarChamadaDeOrdemCorte()
    return true;
  }


  const validarChamadaDeOrdemCorte = () => {
    const idOS = localStorage.getItem('idOS');
      if(!idOS){
        setOpenConfirmarOC(true);    
      }else{
        atualizarOrdemServico();
      }
  };


  const handleCloseConfirmarOC = (confirmed: boolean) => {
    setOpenConfirmarOC(false)
  
    if(confirmed) {
      salvarOrdemServico(true);
    } 
    else { 
      salvarOrdemServico(false);
    }
  };


  const salvarOrdemServico = async (comOC : any) => {


    let statusAtualizado = "INICIADA";
    
    if(comOC === true) {
      statusAtualizado = "PENDENTE";
    }
    setStatusAtt(statusAtualizado);

    const data = {
      qtdeRolos: quantidadeRolo,
      dataEntrada: dataEntrada,
      dataEntrega: dataEntrega,
      qtdePecas: quantidadePecas,
      qtdeMaterialFalhas: quantidadeFalhas,
      qtdeMaterialRestante: quantidadeSobras,
      valorPorPeca: valorPecas,
      valorTotal: valorTotal,
      codReferenciaOs: codReferenciaOs ,
      modelo: modelo,
      numeorNotaFiscal: notaFiscal,
      campoObservacao: observacao,
      status: statusAtualizado,
      clienteId: clienteId, 
    };

    try {
      const response = await apiPost(`/ordemServico/criar`, data);

      if (response.status === STATUS_CODE.CREATED) {

        const ordemServicoId = response.data.id;
        setordemServicoId(ordemServicoId);
        localStorage.setItem("ordemServicoId", ordemServicoId.toString());

        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          if(comOC === true) {
            localStorage.setItem("statusOCiniciada", 'PENDENTE');
            rederionarCadastroOrdemCorte();            
          }else{
            rederionarCadastroListagemDeOS();
          }

        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao salvar ordem de serviço:", error);
    }
  };


  const atualizarOrdemServico = async () => {

    const idOS = localStorage.getItem('idOS');
    const statusOsAtual = localStorage.getItem('statusAtual');

    const data = {
      qtdeRolos: quantidadeRolo,
      dataEntrada: dataEntrada,
      dataEntrega: dataEntrega,
      qtdePecas: quantidadePecas,
      qtdeMaterialFalhas: quantidadeFalhas,
      qtdeMaterialRestante: quantidadeSobras,
      valorPorPeca: valorPecas,
      valorTotal: valorTotal,
      codReferenciaOs: codReferenciaOs ,
      modelo: modelo,
      numeorNotaFiscal: notaFiscal,
      campoObservacao: observacao,
      status: statusOsAtual,
      clienteId: clienteId, 
    };

    try {
      const response = await apiPut(`ordemServico/atualizarOS/${idOS}`, data);

      if (response.status === STATUS_CODE.OK) {
        localStorage.clear();
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
           rederionarCadastroListagemDeOS();
        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao salvar ordem de serviço:", error);
    }
  };


  const calcularValorTotal = () => {
    if (quantidadePecas && valorPecas) {
      setValorTotal(quantidadePecas * valorPecas);
    }
  };


  const carregarClientes = async () => {
    try {
      const response = await apiGet(`endereco/carregar`);
      if (response.status === STATUS_CODE.OK) {
        setClientes(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };


  const rederionarCadastroCliente = async () => {
    navigate('/ordemCliente')
  }

  const rederionarCadastroOrdemCorte = async () => {
    navigate('/ordemCorte')
  }

  const rederionarCadastroListagemDeOS = async () => {
    navigate('/listaServico')
  }


  useEffect(() => {
    carregarClientes();    
  }, []);



  return (
    <div className="cadastro-ordem-container"> <Sidebar></Sidebar>
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
            <li className="active">Ordem de Serviço</li>
            <li>Listagem de Serviços</li>
            <li>Clientes</li>
            <li>Relatórios</li>
            <li>Configurações</li>
          </ul>
        </nav>
      </div> */}
      <div className="content-container">
        <div className="top-bar">
          <div className="top-left">
            <button className="back-button">
              <i className="fa fa-arrow-left"></i> Voltar
            </button>

          </div></div>
        <h2 className="page-title">Cadastro de Ordem de Serviço - Pré corte</h2>
        <hr className="full-line" />
        <div className="action-bar">
          <button 
              className="service-list-button"
              onClick={rederionarCadastroListagemDeOS}
              >Lista de OS's
          </button>          
        </div>

        {/*  FORMULARIO */}
        <div className="form-container">
          <div className="cadastro-ordem-form">
            <div className="form-section">
            <div className="section-title">
                <h3 style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }}>
                  Informações da Ordem de Serviço
                </h3>
                <ContactEmergencyIcon sx={{ verticalAlign: 'middle' }} />
            </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cliente">Cliente*</label>
                  <FormControl fullWidth>
                    <Select
                      labelId="cliente-label"
                      id="cliente"
                      value={clienteId}
                      onChange={(event) => {
                        const id = Number(event.target.value);
                        setClienteId(id);
                        localStorage.setItem('clienteId', id.toString());
                      }}
                      required
                      sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    >
                      {clientes.map((endereco) => (
                      <MenuItem key={endereco.client.id} value={endereco.client.id}>
                        {endereco.client.nomeFantasia}
                      </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                  <Tooltip title="Clique para cadastrar um novo cliente" arrow>
                      <GroupAddIcon 
                        onClick={(rederionarCadastroCliente)} 
                        sx={{ color: 'blue', 
                              fontSize: '2.22rem', 
                              marginLeft: '8px',
                              cursor: 'pointer',
                                '&:hover': {
                                  opacity: 0.7, 
                              }
                            }} 
                      />
                  </Tooltip>
                </div>
                <div className="form-group">
                  <label htmlFor="referencia">Referência*</label>
                  <TextField
                    id="referencia"
                    value={codReferenciaOs}
                    onChange={(event) => setCodReferenciaOs(event.target.value)}
                    fullWidth
                    required
                    sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="modelo">Modelo*</label>
                  <TextField
                    id="modelo"
                    value={modelo}
                    onChange={(event) => setModelo(event.target.value)}
                    fullWidth
                    required
                    sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                </div>
                <div className="form-group">
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dataChegada">Data de Chegada*</label>
                  <TextField
                    id="dataChegada"
                    type="date"
                    value={dataEntrada}
                    onChange={(event) => setdataEntrada(event.target.value)}
                    fullWidth
                    required
                    sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dataEntrega">Data de Entrega*</label>
                  <TextField
                    id="dataEntrega"
                    type="date"
                    value={dataEntrega}
                    onChange={(event) => setdataEntrega(event.target.value)}
                    fullWidth
                    required
                    sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                  />
                </div>
                <div className="form-group">
                <label htmlFor="quantidadeRolo">Quantidade de Rolo*</label>
                  <TextField
                    id="quantidadeRolo"
                    type="number"
                    value={quantidadeRolo}
                    onChange={(event) => {
                      const valor = (Number(event.target.value));
                      if (valor >= 0){
                        setQuantidadeRolo(valor);
                      }
                      }
                    }                    
                    fullWidth
                    required
                    sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                  />
                </div>
                
              </div>
              
              <hr className="full-line" />
             <div className="form-section"> 
             <div className="section-title">
                <h3 style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', paddingTop: '5px' }}>
                Detalhes do Corte
                </h3>
                <DisplaySettingsIcon sx={{ verticalAlign: 'middle' }} />
            </div>
                <div className="form-row">
                <div className="form-group">
                    <label htmlFor="notaFiscal">Nota Fiscal*</label>
                    <TextField
                      id="notaFiscal"
                      value={notaFiscal}
                      onChange={(event) => {
                        const valor = (Number(event.target.value));
                        if (valor >= 0) {
                          setNotaFiscal(valor)  
                        }
                      }}
                      fullWidth
                      required
                      sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    />
                  </div>
                {/* teste */}

                  <div className="form-group">
                    <label htmlFor="valorPecas">Valor das Peças*</label>
                    <TextField
                      id="valorPecas"
                      type="number"
                      value={valorPecas}
                      onChange={(event) => {
                        const valor = Number(event.target.value);
                        if (valor >= 0) {
                          setValorPecas(valor)  
                        }
                      }} 
                      fullWidth
                      required
                      sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    />
                  </div>
                </div>
                <div className="form-row">
                <div className="form-group">
                    <label htmlFor="quantidadePecas">Quantidade de Peças*</label>
                    <TextField
                      id="quantidadePecas"
                      type="number"
                      value={quantidadePecas}
                      onChange={(event) => {
                        const valor = (Number(event.target.value));
                        if (valor >= 0){
                          setQuantidadePecas(valor)
                        }
                      }}
                      fullWidth
                      required
                      onBlur={calcularValorTotal}
                      sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="valorTotal">Valor Total*</label>
                    <TextField
                      id="valorTotal"
                      type="number"
                      value={valorTotal}
                      onChange={(event) => setValorTotal(Number(valorTotal))}
                      fullWidth
                      required
                      sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    /> </div>
                </div>
              </div>
              <hr className="full-line" />
              <div className="form-section">
              <div className="section-title">
                <h3 style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', paddingTop: '5px' }}>
                Observações e Notas
                </h3>
                <DescriptionIcon sx={{ verticalAlign: 'middle' }} />
              </div>

                <div className="form-row">
                  <div className="form-group">
                  </div>
                </div>

                <div className="form-row">
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="observacao">Observação</label>
                    <TextField
                      id="observacao"
                      multiline
                      rows={4}
                      value={observacao}
                      onChange={(event) => setObservacao(event.target.value)}
                      fullWidth
                      sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-footer">
              {alertaErro && (
                <Alert 
                   variant="filled" 
                   severity="error"
                  sx={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    width: '33%',
                    borderRadius: 2,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.0rem'
                  }}
                >
                  Todos os campos são obrigatórios! Certifique-se de que nenhum está vazio.
                </Alert>
              )}

                <Button
                  variant="contained"
                  onClick={validarCamposObrigatorios}
                  sx={{ backgroundColor: '#1976d2', color: 'white', marginTop: 2 }}
                >
                  Salvar Ordem de Serviço
                </Button>
                <ConfirmarOC open={openConfirmarOC} onClose={handleCloseConfirmarOC} />
              </div>
              
            </div>
          </div>
          <Modal
                open={open}
                onClose={() => setOpen(false)}
              >
                <Box className="alert-box" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
                    <Alert variant="filled" sx={{ mb: 2 }}>Ordem de serviço salva com sucesso!</Alert>
                </Box>
            </Modal>
        </div>
      {/* FIMMM */}
      </div>
    </div>
  );
};

export default CadastroOrdemServico;
function setGrade(arg0: (prevGrade: any[]) => any[]) {
  throw new Error('Function not implemented.');
}

