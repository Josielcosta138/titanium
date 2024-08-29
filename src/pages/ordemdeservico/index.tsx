import React, { FC, useState } from "react";
import "./index.css";

const OrderService: FC = () => {
  const [cliente, setCliente] = useState<string>("");
  const [referencia, setReferencia] = useState<string>("");
  const [modelo, setModelo] = useState<string>("");
  const [tecidos, setTecidos] = useState<string>("");
  const [quantidadeRolo, setQuantidadeRolo] = useState<number | undefined>();
  const [grade, setGrade] = useState<string>("");
  const [feitos, setFeitos] = useState<string>("");
  const [dataChegada, setDataChegada] = useState<string>("");
  const [dataEntrega, setDataEntrega] = useState<string>("");
  const [larguraMinima, setLarguraMinima] = useState<number | undefined>();
  const [notaFiscal, setNotaFiscal] = useState<string>("");
  const [quantidadeSobras, setQuantidadeSobras] = useState<number | undefined>();
  const [quantidadeFalhas, setQuantidadeFalhas] = useState<number | undefined>();
  const [quantidadePecas, setQuantidadePecas] = useState<number | undefined>();
  const [valorPecas, setValorPecas] = useState<number | undefined>();
  const [valorTotal, setValorTotal] = useState<number | undefined>();
  const [realizadoCorte, setRealizadoCorte] = useState<string>("");
  const [observacao, setObservacao] = useState<string>("");

  const handleSubmit = () => {
    // Lógica para salvar os dados da ordem de serviços
    console.log("Ordem de Serviço:", {
      cliente, referencia, modelo, tecidos, quantidadeRolo, grade, feitos, 
      dataChegada, dataEntrega, larguraMinima, notaFiscal, quantidadeSobras, 
      quantidadeFalhas, quantidadePecas, valorPecas, valorTotal, realizadoCorte, observacao
    });
  };

  return (
    <div className="order-service-container">
      <div className="sidebar">
        <div className="titulo-container">
          <div className="vertical-line"></div>
          <h1 className="titulo">Titanium</h1>
        </div>
        <div className="profile-pic">
          <img src="/path/to/profile-pic.jpg" alt="Foto do Perfil" />
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>Cadastrar Ordem de Serviço</li>
            <li>Lista de Serviços</li>
            <li>Cadastrar Clientes</li>
            <li>Lista de Clientes</li>
            <li>Relatórios</li>
            <li>Configurações</li>
          </ul>
        </nav>
      </div>

      <div className="order-service-form">
        <h2>Cadastrar Ordem de Serviço</h2>
        <div className="form-group">
          <label htmlFor="cliente">Cliente*</label>
          <input
            type="text"
            id="cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Selecione ou cadastre um cliente"
            required
          />
          <small>Se não encontrar, cadastre-o na seção 'Clientes'</small>
        </div>

        <div className="form-group">
          <label htmlFor="referencia">Referência*</label>
          <input
            type="text"
            id="referencia"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="modelo">Modelo*</label>
          <input
            type="text"
            id="modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tecidos">Tipos de Tecidos*</label>
          <input
            type="text"
            id="tecidos"
            value={tecidos}
            onChange={(e) => setTecidos(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantidadeRolo">Quantidade de Rolo*</label>
          <input
            type="number"
            id="quantidadeRolo"
            value={quantidadeRolo}
            onChange={(e) => setQuantidadeRolo(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="grade">Grade*</label>
          <input
            type="text"
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="feitos">Feito Modelagens/Encaixe/Plotagem*</label>
          <input
            type="text"
            id="feitos"
            value={feitos}
            onChange={(e) => setFeitos(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dataChegada">Data de Chegada*</label>
          <input
            type="date"
            id="dataChegada"
            value={dataChegada}
            onChange={(e) => setDataChegada(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dataEntrega">Data - Previsão de Entrega*</label>
          <input
            type="date"
            id="dataEntrega"
            value={dataEntrega}
            onChange={(e) => setDataEntrega(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="larguraMinima">Largura Minima (Metros)*</label>
          <input
            type="number"
            id="larguraMinima"
            value={larguraMinima}
            onChange={(e) => setLarguraMinima(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notaFiscal">N° Nota Fiscal (Opcional)</label>
          <input
            type="text"
            id="notaFiscal"
            value={notaFiscal}
            onChange={(e) => setNotaFiscal(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantidadeSobras">Quantidade de Sobras</label>
          <input
            type="number"
            id="quantidadeSobras"
            value={quantidadeSobras}
            onChange={(e) => setQuantidadeSobras(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantidadeFalhas">Quantidade de Falhas</label>
          <input
            type="number"
            id="quantidadeFalhas"
            value={quantidadeFalhas}
            onChange={(e) => setQuantidadeFalhas(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantidadePecas">Quantidade de Peças*</label>
          <input
            type="number"
            id="quantidadePecas"
            value={quantidadePecas}
            onChange={(e) => setQuantidadePecas(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="valorPecas">Valor por Peças*</label>
          <input
            type="number"
            id="valorPecas"
            value={valorPecas}
            onChange={(e) => setValorPecas(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="valorTotal">Valor Total</label>
          <input
            type="number"
            id="valorTotal"
            value={valorTotal}
            onChange={(e) => setValorTotal(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="realizadoCorte">Realizado de Corte</label>
          <input
            type="text"
            id="realizadoCorte"
            value={realizadoCorte}
            onChange={(e) => setRealizadoCorte(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="observacao">Observação</label>
          <textarea
            id="observacao"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Cadastrar Ordem de Serviço
        </button>
      </div>
    </div>
  );
};

export default OrderService;
