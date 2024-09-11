import { FC, useState } from "react"
import "./index.css";
import { apiPost, STATUS_CODE } from "../../api/RestClient";

const MateriaPrima: FC = () => {

    const [materia, setMateria] = useState<string>("");
    const [comprimento, setComprimento] = useState<number | undefined>();
    const [qtde, setQtde] = useState<number | undefined>();
    const [largura, setLargura] = useState<number | undefined>();
    const [codReferencia, setCodReferencia] = useState<string>("");
    const [materiaId, setIdMateria] = useState<number | undefined>();

    const salvarMateria = async () => {
        const data = {
            materia: materia,
            comprimento: comprimento,
            qtde: qtde,
            largura: largura,
            codReferencia: codReferencia
        };

        try {
            const response = await apiPost(`materiaPrima/criarMateriaPrima`, data);

            if (response.status === STATUS_CODE.CREATED) {
                const materiaId = response.data.id;
                setIdMateria(materiaId);
                localStorage.setItem("idMateria", materiaId);
            }
        } catch (error) {
            console.error("erro ao salvar materia: ");
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
                        <div className="form-group">
                            <label htmlFor="nome-materia">Nome do tecido</label>
                            <input
                                type="text"
                                id="nome"
                                value={materia}
                                onChange={(e) => setMateria(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="comprimento">Comprimento</label>
                            <input
                                type="number"
                                id="nome"
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

                        <button
                            onClick={salvarMateria}
                            type="submit"
                            className="submit-button" >
                            Cadastrar Materia Prima </button>

                    </div>
                </div>
            </div>

        </div>

    );
};

export default MateriaPrima;