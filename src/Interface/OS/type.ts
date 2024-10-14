export interface IOrdemServico {
    enderecos: any
    id: number,
    qtdeRolos: number,
    dataEntrada: string,
    dataEntrega: string,
    qtdePecas: number,
    qtdeMaterialFalhas: number,
    qtdeMaterialRestante: number,
    valorPorPeca: number,
    valorTotal: number,
    codReferenciaOs: string,
    modelo: string,
    numeorNotaFiscal: number,
    campoObservacao: string,
    status: string,
    cliente: {
        id: number,
        razaoSocial: string,
        nomeFantasia: string,
        email: string,
        telefone: string,  
        cnpj: string,
    },
    gradeMateriaPrimaList: any,  
    ordensDeCorte: Array<{
        id: number,
        materiaPrima: {
            id: number,
            nome: string,
            comprimento: number,
            qtde: number,
            largura: number,
            codReferencia: string,
        },
        ordemServico: any,  
        ordemCorteTamanhos: any  
    }>,

    enderecosCliemte: Array<{
        id: number,
        rua: string,
        bairro: string,
        cidadeResponseDomList: Array<{
            cidade: {
                id: number,
                name: string,
                uf: string
            }
        }>
    }>

}
