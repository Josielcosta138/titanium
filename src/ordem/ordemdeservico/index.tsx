import React, { useState } from 'react';
import './index.css';
import { apiPost, STATUS_CODE } from '../../api/RestClient';
import { Alert, Box, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel } from '@mui/material';

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
  const [cliente, setCliente] = useState<string>('');
  const [referencia, setReferencia] = useState<string>('');
  const [modelo, setModelo] = useState<string>('');
  const [tecidos, setTecidos] = useState<string>('');
  const [quantidadeRolo, setQuantidadeRolo] = useState<number | ''>('');
  const [grade, setGrade] = useState<any[]>([]);
  const [feitosModelagemEncaixePlotagem, setFeitosModelagemEncaixePlotagem] = useState<{ modelagem: boolean, encaixe: boolean, plotagem: boolean }>({ modelagem: false, encaixe: false, plotagem: false });
  const [dataChegada, setDataChegada] = useState<string>('');
  const [dataEntrega, setDataEntrega] = useState<string>('');
  const [larguraMinima, setLarguraMinima] = useState<number | ''>('');
  const [notaFiscal, setNotaFiscal] = useState<string>('');
  const [quantidadeSobras, setQuantidadeSobras] = useState<number | ''>('');
  const [quantidadeFalhas, setQuantidadeFalhas] = useState<number | ''>('');
  const [quantidadePecas, setQuantidadePecas] = useState<number | ''>('');
  const [valorPecas, setValorPecas] = useState<number | ''>('');
  const [valorTotal, setValorTotal] = useState<number | ''>('');
  const [realizadoCorte, setRealizadoCorte] = useState<boolean>(false);
  const [observacao, setObservacao] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [openGrade, setOpenGrade] = useState(false);
  const [openModelagem, setOpenModelagem] = useState(false);

  const calcularValorTotal = () => {
    if (quantidadePecas && valorPecas) {
      setValorTotal(quantidadePecas * valorPecas);
    }
  };

  const salvarOrdemServico = async () => {
    const data = {
      cliente,
      referencia,
      modelo,
      tecidos,
      quantidadeRolo,
      grade,
      feitosModelagemEncaixePlotagem,
      dataChegada,
      dataEntrega,
      larguraMinima,
      notaFiscal,
      quantidadeSobras,
      quantidadeFalhas,
      quantidadePecas,
      valorPecas,
      valorTotal,
      realizadoCorte,
      observacao,
    };

    try {
      const response = await apiPost(`/ordemServico/criar`, data);

      if (response.status === STATUS_CODE.CREATED) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao salvar ordem de serviço:", error);
    }
  };

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
          <button className="service-list-button">Ordem de Serviços</button>
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
                      value={cliente}
                      onChange={(event) => setCliente(event.target.value)}
                      required
                      sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                    >
                      <MenuItem value="cliente1">Cliente 1</MenuItem>
                      <MenuItem value="cliente2">Cliente 2</MenuItem>
                      {/* Adicione mais opções conforme necessário */}
                    </Select>
                  </FormControl>
                </div>
                <div className="form-group">
                  <label htmlFor="referencia">Referência*</label>
                  <TextField
                    id="referencia"
                    value={referencia}
                    onChange={(event) => setReferencia(event.target.value)}
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
                  <label htmlFor="tecidos">Tecidos*</label>
                  <TextField
                    id="tecidos"
                    value={tecidos}
                    onChange={(event) => setTecidos(event.target.value)}
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
                    onChange={(event) => setQuantidadeRolo(Number(event.target.value))}
                    fullWidth
                    required
                    sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                  />
                </div>
                <div className="form-group">
                  <Button
                    variant="outlined"
                    onClick={() => setOpenGrade(true)}
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
                    value={dataChegada}
                    onChange={(event) => setDataChegada(event.target.value)}
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
                    onChange={(event) => setDataEntrega(event.target.value)}
                    fullWidth
                    required
                    sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                  />


                </div>

                <div className="form-group">
                  <Button
                    variant="outlined"
                    onClick={() => setOpenModelagem(true)}
                    sx={{ marginTop: 1 }}
                  >
                    Modelagem, Encaixe e Plotagem
                  </Button>
                  <Modal
                    open={openModelagem}
                    onClose={() => setOpenModelagem(false)}
                    aria-labelledby="modelagem-modal-title"
                    aria-describedby="modelagem-modal-description"
                  >
                    <Box sx={{ ...modalStyle }}>
                      <h2 id="modelagem-modal-title">Modelagem, Encaixe e Plotagem</h2>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={feitosModelagemEncaixePlotagem.modelagem}
                            onChange={(event) => setFeitosModelagemEncaixePlotagem({ ...feitosModelagemEncaixePlotagem, modelagem: event.target.checked })}
                          />
                        }
                        label="Modelagem"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={feitosModelagemEncaixePlotagem.encaixe}
                            onChange={(event) => setFeitosModelagemEncaixePlotagem({ ...feitosModelagemEncaixePlotagem, encaixe: event.target.checked })}
                          />
                        }
                        label="Encaixe"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={feitosModelagemEncaixePlotagem.plotagem}
                            onChange={(event) => setFeitosModelagemEncaixePlotagem({ ...feitosModelagemEncaixePlotagem, plotagem: event.target.checked })}
                          />
                        }
                        label="Plotagem"
                      />
                      <Button onClick={() => setOpenModelagem(false)}>Salvar</Button>
                    </Box>
                  </Modal>
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
                      value={larguraMinima}
                      onChange={(event) => setLarguraMinima(Number(event.target.value))}
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
                      onChange={(event) => setNotaFiscal(event.target.value)}
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
                      fullWidth
                      disabled
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
                          checked={realizadoCorte}
                          onChange={(event) => setRealizadoCorte(event.target.checked)}
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

          {/* Modal Grade */}
          <Modal open={openGrade} onClose={() => setOpenGrade(false)}>
            <Box className="modal-container">
              <h2>Selecionar Grade</h2>
              {/* Aqui você pode adicionar os elementos para seleção da grade */}
              <Button onClick={() => setOpenGrade(false)}>Fechar</Button>
            </Box>
          </Modal>

          {/* Modal Modelagem */}


          {/* Alerta de sucesso */}
          <Modal open={open} onClose={() => setOpen(false)}>
            <Box className="modal-container">
              <Alert severity="success">Ordem de serviço salva com sucesso!</Alert>
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

