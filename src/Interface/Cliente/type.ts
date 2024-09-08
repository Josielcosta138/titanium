export interface IClientes {

    id: number,
    rua: string,
    bairro: string,
    clienteId: number,
    cidadeId: number,
    client: {
        id: number,
        razaoSocial: string, 
        nomeFantasia: string, 
        email: string,
        telefone: string,
        cnpj: string,
        ordensServico: []
    },
    cidades: {
        id: number,
        name: string,
        uf: string,
    }
} 

