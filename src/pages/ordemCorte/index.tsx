import { FC, useEffect, useState } from "react";
import "./index.css";
import Checkbox from '@mui/material/Checkbox';
import {
    Alert,
    Box,
    Modal,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    TableContainer,
    TextField
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import MateriaPrima from "../materia";
import { apiGet, apiPost, apiPut, STATUS_CODE } from "../../api/RestClient";
import { IMateriaPrima } from "../../Interface/MateriaPrima/type";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';
import { stat } from "fs";



const OrdemCorte: FC = () => {
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [materiaPrimaId, setMateriaPrimaId] = useState<number>();
    const [materiasPrimas, setMateriasPrimas] = useState<IMateriaPrima[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMaterias, setSelectedMaterias] = useState<number[]>([]);
    const [page, setPage] = useState(1);
    const [tamanhos, setTamanhos] = useState([
        { id: 1, nome: 'PP' },
        { id: 2, nome: 'P' },
        { id: 3, nome: 'M' },
        { id: 4, nome: 'G' },
        { id: 5, nome: 'GG' },
        { id: 6, nome: 'GG1' },
        { id: 7, nome: 'GG2' },
        { id: 8, nome: 'GG3' },
        { id: 9, nome: 'GG4' },
        { id: 10, nome: 'GG5' },
        { id: 11, nome: 'GG6' },
        { id: 12, nome: 'GG7' },
        { id: 13, nome: 'GG8' },
        { id: 14, nome: 'GG9' },
        { id: 15, nome: 'GG10' },
        { id: 16, nome: '30' },
        { id: 17, nome: '32' },
        { id: 18, nome: '34' },
        { id: 19, nome: '36' },
        { id: 20, nome: '38' },
        { id: 21, nome: '40' },
        { id: 22, nome: '42' },
        { id: 23, nome: '44' },
        { id: 24, nome: '46' },
        { id: 25, nome: '48' },
        { id: 26, nome: '50' },
        { id: 27, nome: '52' },
        { id: 28, nome: '54' },
        { id: 29, nome: '56' },
        { id: 30, nome: '58' },
        { id: 31, nome: '60' },
        { id: 32, nome: '62' },
    ]);
    const [quantidade, setQuantidades] = useState<{ [key: number]: number }>({});
    const navigate = useNavigate();
    const steps = ['Cadastrar Matéria prima', 'Cadastrar Grade', 'Finalizar ordem de corte'];
    const [status, setStatus] = useState<string>(''); 
    // No estado de OrdemCorte
    const [quantidadeFalhas, setQuantidadeFalhas] = useState<number | ''>(''); 
    const [quantidadeSobras, setQuantidadeSobras] = useState<number | ''>(''); 
    const [qtde, setQtde] = useState<number>(); 




    const handleNext = async () => {
        if (activeStep === steps.length - 1) {
            await salvarOrdemCorte();
            
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        listaOrdemServico();
    };


    const editarMateriaPrima = async (id: number) => {
        localStorage.setItem('idMateriaPrima', id.toString());
        window.location.reload();
    };


    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };


    const listaOrdemServico = async () => {
        navigate(`/listaServico`)

    }

    const YourComponent = () => {
        const [selectedMaterias, setSelectedMaterias] = useState<number[]>([]);
    
        useEffect(() => {
            const savedMaterias = localStorage.getItem('selectedMaterias');
            if (savedMaterias) {
                setSelectedMaterias(JSON.parse(savedMaterias));
            }
        }, []);
    }


    const handleToggle = (id: number) => {
        setSelectedMaterias([id]); 
        localStorage.setItem('idMateriaisLista', JSON.stringify([id]));
        setMateriaPrimaId(id);
    };



    useEffect(() => {
        carregarMateriasPrimas();
    }, [page]);



    const handleQuantidadeGrade = (tamanhoId: number, quantidade: number) => {
        // Atualiza o estado local de quantidades
        setQuantidades(prev => ({
            ...prev,
            [tamanhoId]: quantidade
        }));
    
        // Atualiza ou adiciona a quantidade do tamanho
        const storedGrades = JSON.parse(localStorage.getItem('idGrade') || '{}');
        const updatedGrades = {
            ...storedGrades,
            [tamanhoId]: quantidade
        };

        localStorage.setItem('idGrade', JSON.stringify(updatedGrades));
    };
    


    // -------------- MÉTODOS CARREGAR - SALVAR ------------------- 

    const carregarMateriasPrimas = async () => {
        try {
            const response = await apiGet(`materiaprima/carregar`);
            if (response.status === STATUS_CODE.OK) {
                setMateriasPrimas(response.data.materiasPrimas || response.data);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Erro ao carregar matérias-primas:", error);
        }
    };



    const salvarOrdemCorteTamanhos = async (idOrdemCorte: any) => {
        const data = {
            ordemDeCorteId: idOrdemCorte,
            tamanhos: Object.keys(quantidade).map(tamanhoId => ({
                tamanhoGradeId: tamanhoId,
                quantidade: quantidade[Number(tamanhoId)]
            }))
        };
    
        try {
            const response = await apiPost("/ordemCorteTamanho/criar", data);
            if (response.status === STATUS_CODE.CREATED) {
                setOpen(true);
                setTimeout(() => {
                    setOpen(false);
                    // localStorage.clear();
                }, 5000);
            }
        } catch (error) {
            console.error("Erro ao salvar grade:", error);
        }
    };



    const salvarOrdemCorte = async () => {
        localStorage.setItem("statusGeradaOC", 'PENDENTE');

        const ordemServicoId = localStorage.getItem('ordemServicoId');
        const data = {
            servicoId: ordemServicoId,
            materiaPrimaId: materiaPrimaId,
        };

        try {
            const response = await apiPost("/ordemCorte/criar", data);
            if (response.status === STATUS_CODE.CREATED) {
                const idOrdemCorte = response.data.id;
                setOpen(true);
                await salvarOrdemCorteTamanhos(idOrdemCorte);
                atualizarStatusDaOs();
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        } catch (error) {
            console.error("Erro ao salvar ordem de corte:", error);
        }
    };


    const atualizarStatusDaOs = async () => {

        const idOs = localStorage.getItem('ordemServicoId');

        const statusInciada = localStorage.getItem('statusOCiniciada');
        const statusOC = localStorage.getItem('statusOC');
        const statusGeradaOC = localStorage.getItem('statusGeradaOC');

        let statusAtt;
        if (statusInciada){
            statusAtt = statusInciada
        }else if (statusOC){
            statusAtt = statusOC
        }
        else if (statusGeradaOC){
            statusAtt = statusGeradaOC
        }
        

        const data = {
            status: statusAtt
        };

        try {
            const response = await apiPut(`ordemServico/atualizarStatusOs/${idOs}`, data);
      
            if (response.status === STATUS_CODE.OK) {
                atualizarQtdesOrdemServico(Number(idOs));
            }
          } catch (error) {
            console.error("Erro ao salvar ordem de serviço:", error);
          }
    }


    const atualizarQtdesOrdemServico = async (idOs : Number) => {
        const idOS = idOs;
        const data = {
            qtdeMaterialFalhas: quantidadeFalhas,
            qtdeMaterialRestante: quantidadeSobras,
        };

        try {
            const response = await apiPut(`ordemServico/atualizarQtdesFalhasSobras/${idOS}`, data);

            if (response.status === STATUS_CODE.OK) {
             
                
                localStorage.clear();
                setOpen(true);
                setTimeout(() => {
                    setOpen(false);
                }, 5000);
            }
        } catch (error) {
            console.error("Erro ao atualizar ordem de serviço:", error);
        }
    };



  
    const redirecionarCadastroListagemDeOS = () => {
        navigate('/listaServico');
    };



    return (
        <div className="materia-container">
            <div className="sidebar">
            </div>
            <div className="content-container">
                <div className="top-bar">
                    <div className="top-left">
                        <h2>Cadastro de Ordem de corte</h2>
                    </div>
                    <div className="top-right">
                        <Alert severity="warning">Atualmente, o sistema registra 'Sobras' e 'Falhas' para todos os materiais. Por favor, verifique os detalhes e tome as ações necessárias!</Alert>
                    </div>
                </div>

                <hr className="full-line" />

                <div className="form-container">
                    <div className="materia-form">
                        <Box sx={{ width: '100%' }}>
                            <Stepper activeStep={activeStep}>
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {index === 0 && (
                                                    <Button onClick={handleNext} sx={{ mr: 1 }}>
                                                        <AddIcon />
                                                    </Button>
                                                )}
                                                {label}
                                            </Box>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            {activeStep === steps.length ? (
                                <React.Fragment>
                                    <Typography sx={{ 
                                            mt: 2, 
                                            mb: 1, 
                                            display: 'flex', 
                                            fontSize: '15px', 
                                            alignItems: 'center', 
                                            fontWeight: 'bold' }}
                                        >Todas as etapas foram concluídas com sucesso!
                                        <CheckIcon sx={{ color: 'green', fontSize: 40, ml: 1 }} />
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        <Button onClick={handleReset}>Reiniciar</Button>
                                    </Box>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Typography sx={{ mt: 2, mb: 1 }}>Etapa {activeStep + 1}</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                        <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                                            Voltar
                                        </Button>
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        <Button onClick={handleNext}>
                                            {activeStep === steps.length - 1 ? 'Salvar corte' : 'Próximo'}
                                        </Button>
                                    </Box>
                                </React.Fragment>
                            )}

                            {activeStep === 0 && (
                                <div className="table-container">
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Código</TableCell>
                                                    <TableCell>Nome</TableCell>
                                                    <TableCell>Comprimento</TableCell>
                                                    <TableCell>Quantidade</TableCell>
                                                    <TableCell>Largura</TableCell>
                                                    <TableCell>Código de Referência</TableCell>
                                                    <TableCell>Selecionar</TableCell>
                                                    <TableCell>Editar</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {materiasPrimas.map(materiaPrima => (
                                                <TableRow key={materiaPrima.id}>
                                                     <TableCell>{materiaPrima.id}</TableCell>
                                                     <TableCell>{materiaPrima.nome}</TableCell>
                                                    <TableCell>{materiaPrima.comprimento}</TableCell>
                                                    <TableCell>{materiaPrima.qtde}</TableCell>
                                                    <TableCell>{materiaPrima.largura}</TableCell>
                                                    <TableCell>{materiaPrima.codReferencia}</TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedMaterias.includes(materiaPrima.id)}
                                                            onChange={() => handleToggle(materiaPrima.id)}
                                                        />
                                                    </TableCell>
                                                    
                                                    <TableCell>
                                                        <Box className="action-buttons">
                                                            <Button variant="contained" color="warning" onClick={() => editarMateriaPrima(materiaPrima.id)}>
                                                                Editar
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <div className="results-info">
                                        Mostrando 1 de 6 de {materiasPrimas.length} resultados
                                        <div className="pagination-info">
                                            <Button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
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
                                            <Button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>
                                                Próximo
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeStep === 0 && (
                                <MateriaPrima />
                            )}

                            {activeStep === 1 && ( 
                                <div className="form-container">
                                    <div className="materia-form">
                                        <h3>Cadastrar Grade</h3>  
                                        <h4>Informe a quantidade:</h4>
                                        <div className="tamanho-container">
                                            {tamanhos.map(tamanho => (
                                                <div key={tamanho.id} className="form-group-grade">
                                                    <label>{tamanho.nome}:</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={quantidade[tamanho.id] || ''}
                                                        onChange={(e) => handleQuantidadeGrade(tamanho.id, Number(e.target.value))}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                                {activeStep === 2 && (
                                                            <div className="cadastro-ordem-container">
                                                                <div className="content-container">
                                                                    <div className="form-container">
                                                                        <div className="cadastro-ordem-form">
                                                                            <div className="form-section">
                                                                                <h3>Registro de Quantidades Restantes de Materiais</h3>
                                                                                <div className="form-row">
                                                                                    <div className="form-group">
                                                                                        <label htmlFor="quantidadeSobras">Quantidade de Sobras*</label>
                                                                                        <TextField
                                                                                            id="quantidadeSobras"
                                                                                            type="number"
                                                                                            value={quantidadeSobras}
                                                                                            onChange={(event) => setQuantidadeSobras(event.target.value === '' ? '' : Number(event.target.value))}
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
                                                                                            onChange={(event) => setQuantidadeFalhas(event.target.value === '' ? '' : Number(event.target.value))}
                                                                                            fullWidth
                                                                                            required
                                                                                            sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="form-group">
                                                                                        <label htmlFor="quantidadeRolos">Quantidade de Rolos*</label>
                                                                                        <TextField
                                                                                            id="quantidadeRolos"
                                                                                            type="number"
                                                                                            value={qtde}
                                                                                            onChange={(event) => setQtde(event.target.value === '' ? undefined : Number(event.target.value))}
                                                                                            fullWidth
                                                                                            required
                                                                                            sx={{ backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        </Box>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
};

export default OrdemCorte;