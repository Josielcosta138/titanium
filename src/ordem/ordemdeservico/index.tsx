import React, { useEffect, useState } from 'react';
import './index.css';
import { apiGet, apiPost, STATUS_CODE } from '../../api/RestClient';
import { Alert, Box, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel, InputAdornment, Tooltip } from '@mui/material';
import { IClientes } from '../../Interface/Cliente/type';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Navigate, useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoIcon from '@mui/icons-material/Info';



const handleGradeChange = (size: any, quantity: number) => {
  setGrade((prevGrade: any[]) => {
    const updatedGrade = prevGrade.filter(g => g.size !== size);
    if (quantity > 0) {
      updatedGrade.push({ size, quantity });
    }
    return updatedGrade;
  });
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const CadastroOrdemServico: React.FC = () => {
  const [clienteId, setClienteId] = useState<number | ''>(''); 
  const [codReferenciaOs, setCodReferenciaOs] = useState<string>(''); 
  const [modelo, setModelo] = useState<string>('');
  const [quantidadeRolo, setQuantidadeRolo] = useState<number | ''>(''); 
  const [quantidadePecas, setQuantidadePecas] = useState<number | ''>('');
  const [quantidadeFalhas, setQuantidadeFalhas] = useState<number | ''>('');
  const [quantidadeSobras, setQuantidadeSobras] = useState<number | ''>(''); 
  const [valorPecas, setValorPecas] = useState<number | ''>('');
  const [valorTotal, setValorTotal] = useState<number | ''>('');
  const [notaFiscal, setNotaFiscal] = useState<number | ''>(''); 
  const [dataEntrada, setdataEntrada] = useState<string>(''); 
  const [dataEntrega, setdataEntrega] = useState<string>(''); 
  const [observacao, setObservacao] = useState<string>('');
  const [status, setStatus] = useState<string>(''); 
  const [open, setOpen] = useState(false);
  const [clientes, setClientes] = useState<IClientes[]>([]);
  const [ordemServicoId, setordemServicoId] = useState<number>();
  const navigate = useNavigate();

  const calcularValorTotal = () => {
    if (quantidadePecas && valorPecas) {
      setValorTotal(quantidadePecas * valorPecas);
    }
  };

  const salvarOrdemServico = async () => {
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
      status: "PENDENTE",
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
          // atualizarPagina(); DESCOMENTAR APÓS FINALIZAR A ORDEM CORTE

        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao salvar ordem de serviço:", error);
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


  const atualizarPagina = async () => {
    window.location.reload();
  }

  const rederionarCadastroCliente = async () => {
    navigate('/ordemCliente')
  }

  const rederionarCadastroOrdemCorte = async () => {
    navigate('/ordemCorte')
  }


  const iniciaOrdemServico = async () => {
    window.alert('Inicia ordem')
  }



  useEffect(() => {
    carregarClientes();
  }, []);




  return (
    <div className="cadastro-ordem-container">
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

          </div></div>

        <h2 className="page-title">Cadastro de Ordem de Serviço</h2>

        <hr className="full-line" />

        <div className="action-bar">
          <button 
              className="service-list-button"
              onClick={iniciaOrdemServico}
              >Iniciar Serviços
          </button>
          <div className="filter-container">
            <input type="text" placeholder="Pesquisar..." className="search-bar" />
            <button className="filter-button">Filtrar <i className="fa fa-caret-down"></i></button>
          </div>
        </div>

        <div className="form-container">
          <div className="cadastro-ordem-form">
            <div className="form-section">
              <h3>Pré-Corte</h3>
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
                  <label htmlFor="tecidos">Ordem de corte*</label>
                  <TextField
                    id="tecidos"
                    // value={}
                    // onChange={(event) => setTecidos(event.target.value)}
                    fullWidth
                    required
                    sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                  />


                  <Tooltip title="Cadastrar Ordem de corte" arrow>
                      <AssignmentIcon 
                        onClick={(rederionarCadastroOrdemCorte)} 
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

                  <Tooltip 
                    title={
                      <span style={{ color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '1.2rem' }}>
                          É obrigatório o cadastro da Ordem de corte para seguir o cadastro
                      </span>
                  }
                    >
                      <InfoIcon 
                        sx={{ color: 'grey', 
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
                  <label htmlFor="quantidadeRolo">Quantidade de Rolo*</label>
                  <TextField
                    id="quantidadeRolo"
                    type="number"
                    value={quantidadeRolo}
                    onChange={(event) => setQuantidadeRolo(Number(event.target.value))}
                    fullWidth
                    required
                    sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                  />
                </div>
                <div className="form-group">
                  <Button
                    variant="outlined"
                    // onClick={() => setOpenGrade(true)}
                    sx={{ marginTop: 1 }}
                  >
                    Selecionar Grade
                  </Button>
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
                  
                  {/* </Modal> */}
                </div>
              </div>

              <hr className="full-line" />

             <div className="form-section">
              <h3>Corte</h3>
               

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="larguraMinima">Largura Mínima*</label>
                    <TextField
                      id="larguraMinima"
                      type="number"
                      // value={larguraMinima}
                      // onChange={(event) => setLarguraMinima(Number(event.target.value))}
                      fullWidth
                      required
                      sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="notaFiscal">Nota Fiscal*</label>
                    <TextField
                      id="notaFiscal"
                      value={notaFiscal}
                      onChange={(event) => setNotaFiscal(Number(event.target.value))}
                      fullWidth
                      required
                      sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    />

                    <label htmlFor="quantidadeSobras">Quantidade de Sobras*</label>
                    <TextField
                      id="quantidadeSobras"
                      type="number"
                      value={quantidadeSobras}
                      onChange={(event) => setQuantidadeSobras(Number(event.target.value))}
                      fullWidth
                      required
                      sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantidadeFalhas">Quantidade de Falhas*</label>
                    <TextField
                      id="quantidadeFalhas"
                      type="number"
                      value={quantidadeFalhas}
                      onChange={(event) => setQuantidadeFalhas(Number(event.target.value))}
                      fullWidth
                      required
                      sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantidadePecas">Quantidade de Peças*</label>
                    <TextField
                      id="quantidadePecas"
                      type="number"
                      value={quantidadePecas}
                      onChange={(event) => setQuantidadePecas(Number(event.target.value))}
                      fullWidth
                      required
                      onBlur={calcularValorTotal}
                      sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="valorPecas">Valor das Peças*</label>
                    <TextField
                      id="valorPecas"
                      type="number"
                      value={valorPecas}
                      onChange={(event) => setValorPecas(Number(event.target.value))}
                      fullWidth
                      required
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
                <h3>Pós-Corte</h3>
                <div className="form-row">
                  <div className="form-group">
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <FormControlLabel
                      control={
                        <Checkbox
                          // checked={realizadoCorte}
                          // onChange={(event) => setRealizadoCorte(event.target.checked)}
                        />
                      }
                      label="Corte Realizado"
                    />
                  </div>
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
                <Button
                  variant="contained"
                  onClick={salvarOrdemServico}
                  sx={{ backgroundColor: '#1976d2', color: 'white', marginTop: 2 }}
                >
                  Salvar Ordem de Serviço
                </Button>
              </div>
            </div>
          </div>


          {/* Modal Modelagem */}


          <Modal
                open={open}
                onClose={() => setOpen(false)}
              >
                <Box className="alert-box" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
                    <Alert variant="filled" sx={{ mb: 2 }}>Ordem de serviço salva com sucesso!</Alert>
                </Box>
            </Modal>
        </div>
      </div></div>
  );
};

export default CadastroOrdemServico;
function setGrade(arg0: (prevGrade: any[]) => any[]) {
  throw new Error('Function not implemented.');
}

