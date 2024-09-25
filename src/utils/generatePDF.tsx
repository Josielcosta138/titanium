// src/utils/generatePDF.ts
import jsPDF from 'jspdf';
import { IOrdemServico } from '../Interface/OS/type';
import { IOrdemCorte } from '../Interface/OrdemCorte/type';

export const imprimirDadosOrdem = (ordem: IOrdemServico) => {
    if (!ordem) {
        console.error('Nenhuma ordem de serviço selecionada');
        return;
    }

    const doc = new jsPDF();
    let yPosition = 10;

    // Título
    doc.setFontSize(16);
    doc.text("Detalhes da Ordem de Serviço", 10, yPosition);
    yPosition += 10;

    // Detalhes da Ordem de Serviço
    doc.setFontSize(12);
    doc.text(`Código: ${ordem.id}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Quantidade de Rolos: ${ordem.qtdeRolos}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Data de Entrada: ${ordem.dataEntrada}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Data de Entrega: ${ordem.dataEntrega}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Quantidade de Peças: ${ordem.qtdePecas}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Quantidade de Material com Falhas: ${ordem.qtdeMaterialFalhas}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Quantidade de Material Restante: ${ordem.qtdeMaterialRestante}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Valor por Peça: ${ordem.valorPorPeca}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Valor Total: ${ordem.valorTotal}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Código de Referência: ${ordem.codReferenciaOs}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Modelo: ${ordem.modelo}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Número da Nota Fiscal: ${ordem.numeorNotaFiscal}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Observações: ${ordem.campoObservacao}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Status: ${ordem.status}`, 10, yPosition);
    yPosition += 20;

    // Detalhes do Cliente
    doc.setFontSize(16);
    doc.text("Dados do Cliente", 10, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text(`Código do Cliente: ${ordem.cliente.id}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Razão Social: ${ordem.cliente.razaoSocial}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Nome Fantasia: ${ordem.cliente.nomeFantasia}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Email: ${ordem.cliente.email}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Telefone: ${ordem.cliente.telefone}`, 10, yPosition);
    yPosition += 10;
    doc.text(`CNPJ: ${ordem.cliente.cnpj}`, 10, yPosition);
    yPosition += 20;

    // Endereço do Cliente
    doc.setFontSize(16);
    doc.text("Endereço do Cliente", 10, yPosition);
    yPosition += 10;
    doc.setFontSize(12);

    if (ordem.enderecosCliemte && ordem.enderecosCliemte.length > 0) {
        ordem.enderecosCliemte.forEach((endereco, index) => {
            doc.text(`Rua: ${endereco.rua}`, 10, yPosition);
            yPosition += 10;
            doc.text(`Bairro: ${endereco.bairro}`, 10, yPosition);
            yPosition += 10;
            endereco.cidadeResponseDomList.forEach((cidadeInfo) => {
                doc.text(`Cidade: ${cidadeInfo.cidade.name}`, 10, yPosition);
                yPosition += 10;
                doc.text(`UF: ${cidadeInfo.cidade.uf}`, 10, yPosition);
                yPosition += 10;
            });
            yPosition += 10; // Adiciona um espaçamento extra entre endereços
        });
    } else {
        doc.text("Nenhum endereço encontrado.", 10, yPosition);
        yPosition += 10;
    }

    if (ordem.ordensDeCorte && ordem.ordensDeCorte.length > 0) {
            doc.setFontSize(16);
            doc.text("Materiais Usados na Ordem de Corte", 10, 250);
        
            ordem.ordensDeCorte.forEach((corte: IOrdemCorte, index: number) => {
              doc.setFontSize(12);
              const yPosition = 260 + index * 15;
              doc.text(`Material: ${corte.materiaPrima.nome}`, 10, yPosition);
              doc.text(`Comprimento: ${corte.materiaPrima.comprimento}`, 55, yPosition);
              doc.text(`Largura: ${corte.materiaPrima.largura}`,105, yPosition);
              doc.text(`Quantidade: ${corte.materiaPrima.qtde}`, 130, yPosition);
              doc.text(`Cód-Referência: ${corte.materiaPrima.codReferencia}`, 165, yPosition);
            });
          }

    // Salvar PDF
    doc.save(`ordem_servico_${ordem.id}_dados.pdf`);
};
