import { FC, useEffect, useState } from "react";
import "./index.css";
import { apiGet, apiPost, apiPut, STATUS_CODE } from "../../api/RestClient";
import { IMateriaPrima } from "../../Interface/MateriaPrima/type";
import { Alert, Box, Modal, Tooltip } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';



const MateriaPrima: FC = () => {
    const [nome, setNome] = useState<string>('');
    const [comprimento, setComprimento] = useState<number>();
    const [qtde, setQtde] = useState<number>();
    const [largura, setLargura] = useState<number>(0);
    const [qtdeMaterialFalhas, setQtdeMaterialFalhas] = useState<number>(0);
    const [qtdeMaterialRestante, setQtdeMaterialRestante] = useState<number>(0);
    const [codReferencia, setCodReferencia] = useState<string>('');
    const [materiaId, setIdMateria] = useState<number>();
    const [open, setOpen] = useState(false);
    const [alertaErro, setAlertaErro] = useState(false);


    useEffect(() => {
        const idMp = localStorage.getItem('idMateriaPrima')
        if (idMp) {
            carregarDadosMp(Number(idMp));
        }
    }, []);    

    
    const carregarDadosMp = async (id: Number) => {
        try {
            const responseMateriaPrima = await apiGet(`materiaprima/carregar/${id}`);
            const dadosMp = responseMateriaPrima.data;
    
            setNome(dadosMp.nome);
            setComprimento(dadosMp.comprimento);
            setQtde(dadosMp.qtde);
            setLargura(dadosMp.largura);
            setCodReferencia(dadosMp.codReferencia);
            setQtdeMaterialFalhas(dadosMp.qtdeMaterialFalhas);
            setQtdeMaterialRestante(dadosMp.qtdeMaterialRestante);
        } catch (error) {
            console.error("Erro ao carregar dados da matéria prima:", error);
        }
    }


    const validarCamposObrigatorios = async () => {        
        if (
            !nome ||
            !comprimento ||
            !qtde ||
            !largura ||
            !codReferencia
          ) { 
            setAlertaErro(true);  
            setTimeout(() => {
              setAlertaErro(false);
            }, 8000);   
      
            return false;
          }
          setAlertaErro(false);
          gerenciadorDeBotaoSalvar()
          return true;
    }    


    const gerenciadorDeBotaoSalvar = () => {
        const idMp = localStorage.getItem('idMateriaPrima')

        if(!idMp) {
            salvarMateria()
        }
        else{
            atualizarMateriaPrima(Number(idMp))
        }
    }


    const salvarMateria = async () => {
        const data = {
            nome: nome,
            comprimento: comprimento,
            qtde: qtde,
            largura: largura,
            codReferencia: codReferencia,
            qtdeMaterialRestante: qtdeMaterialRestante,
            qtdeMaterialFalhas: qtdeMaterialFalhas
        };
        try {

            const response = await apiPost(`/materiaprima/criarMateriaPrima`, data);
                if (response.status === STATUS_CODE.CREATED) {
                    const materiaId = response.data.id;
                    setIdMateria(materiaId);
                    localStorage.setItem("idMateria-materiaPrima", materiaId);
                    atualizarPagina()
                }
        } catch (error) {
            console.error("erro ao salvar materia: ", error);
        }
    };


    const atualizarMateriaPrima = async (id : Number) => {
        const data = {
            nome: nome,
            comprimento: comprimento,
            qtde: qtde,
            largura: largura,
            codReferencia: codReferencia,
            qtdeMaterialRestante: qtdeMaterialRestante,
            qtdeMaterialFalhas: qtdeMaterialFalhas
        };

        try {
            const response = await apiPut(`/materiaprima/atualizarMateriaPrima/${id}`, data)
            if (response.status === STATUS_CODE.OK) {
                localStorage.clear()
                atualizarPagina()
            }    
        } catch (error) {
            console.error("erro ao salvar materia: ", error);
        }
        

    }


    const atualizarPagina = async () => {
        window.location.reload();
    }


    return (
        <div className="teste-materia-container">
            <div className="content-container">                
                <hr className="full-line" />
                <div className="form-container">
                <div className="section-title">
                <h2 
                    style={{ 
                    display: 'inline', 
                    marginRight: '8px', 
                    verticalAlign: 'middle', 
                    paddingTop: '1px' 
                    }}
                >
                    Cadastrar Matéria Prima
                </h2>

                <Tooltip                     
                    title={
                        <span style={{ 
                            fontSize: '1.2rem', 
                            color:"white" }}
                            >Cadastrar nova matéria-prima para utilizar em ordens de corte futuras.
                        </span>
                      } 
                    arrow placement="top"
                >
                    <InfoIcon sx={{ verticalAlign: 'middle', cursor: 'pointer' }} />
                </Tooltip>
                </div>
                    <div className="materia-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="nome">Nome do tecido</label>
                                <input
                                    type="text"
                                    id="nome"
                                    value={nome}
                                    onChange={(event) => setNome(event.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="comprimento">Comprimento</label>
                                <input
                                    type="number"
                                    id="comprimento"
                                    value={comprimento}
                                    onChange={(e) => setComprimento(Number(e.target.value))}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="qtde">Quantidade em rolos</label>
                                <input
                                    type="number"
                                    id="qtde"
                                    value={qtde}
                                    onChange={(e) => setQtde(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="largura">Largura</label>
                                <input
                                    type="text"
                                    id="largura"
                                    value={largura}
                                    onChange={(e) => {
                                        const valorComVirgula = e.target.value.replace(',', '.');
                                        if (!isNaN(Number(valorComVirgula)) || valorComVirgula === '') {
                                          setLargura(Number(valorComVirgula));
                                        }
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="codReferencia">Código da Referência</label>
                                <input
                                    type="text"
                                    id="codReferencia"
                                    value={codReferencia}
                                    onChange={(e) => setCodReferencia(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="qtdeRestante">Quantidade restante</label>
                                <input
                                    type="number"
                                    id="qtdeRestante"
                                    value={qtdeMaterialRestante}
                                    onChange={(e) => setQtdeMaterialRestante(Number(e.target.value))}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="qtdeFalhas">Quantidade falhas</label>
                                <input
                                    type="number"
                                    id="qtdeFalhas"
                                    value={qtdeMaterialFalhas}
                                    onChange={(e) => setQtdeMaterialFalhas(Number(e.target.value))}
                                />
                            </div>
                        </div>
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

                        <button
                            onClick={validarCamposObrigatorios}
                            type="submit"
                            className="submit-button"
                        >
                            Salvar
                        </button>
                        <Modal
                            open={open}
                            onClose={() => setOpen(false)}
                        >
                        <Box className="alert-box" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
                            <Alert variant="filled" sx={{ mb: 2 }}>Matéria prima salvo com sucesso!</Alert>
                        </Box>
                    </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MateriaPrima;

function onSave(idMateria: string) {
    throw new Error("Function not implemented.");
}
