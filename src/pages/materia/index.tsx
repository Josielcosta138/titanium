import { FC, useState } from "react";
import "./index.css";
import { apiPost, STATUS_CODE } from "../../api/RestClient";
import { IMateriaPrima } from "../../Interface/MateriaPrima/type";
import { Alert, Box, Modal } from "@mui/material";

const MateriaPrima: FC = () => {
    const [nome, setNome] = useState<string>('');
    const [comprimento, setComprimento] = useState<number>();
    const [qtde, setQtde] = useState<number>();
    const [largura, setLargura] = useState<number>();
    const [codReferencia, setCodReferencia] = useState<string>('');
    const [cores, setCores] = useState<string>('');
    const [materiaId, setIdMateria] = useState<number>();
    const [open, setOpen] = useState(false);

    const salvarMateria = async () => {
        const data = {
            nome: nome,
            comprimento: comprimento,
            qtde: qtde,
            largura: largura,
            codReferencia: codReferencia,
            // cores: 'azul'
        };

        try {
            const response = await apiPost(`/materiaprima/criarMateriaPrima`, data);

            if (response.status === STATUS_CODE.CREATED) {
                const materiaId = response.data.id;
                setIdMateria(materiaId);
                localStorage.setItem("idMateria", materiaId);
            }
        } catch (error) {
            console.error("erro ao salvar materia: ", error);
        }
    };

    return (
        <div className="materia-container">
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
                        <li>Ordem de Serviço</li>
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
                        <h2>Cadastro de Materia Prima</h2>
                    </div>
                    <div className="top-right">
                        <button className="icon-button">
                            <i className="fa fa-cog"></i>
                        </button>
                        <button className="icon-button">
                            <i className="fa fa-bell"></i>
                        </button>
                    </div>
                </div>

                <hr className="full-line" />

                <div className="form-container">
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
                                    onChange={(e) => setLargura(Number(e.target.value))}
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
                                <label htmlFor="cores">Cores</label>
                                <input
                                    type="text"
                                    id="cores"
                                    value={cores}
                                    onChange={(e) => setCores(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={salvarMateria}
                            type="submit"
                            className="submit-button"
                        >
                            Cadastrar Materia Prima
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