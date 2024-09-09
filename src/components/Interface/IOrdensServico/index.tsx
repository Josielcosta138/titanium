export interface ICliente {
    id: number;
    nome: string;
    nomeFantasia: string;
    // Adicione outros campos necessários para o cliente
  }
  
  export interface IOrdemServico {
    id: number;
    codigo: string;
    descricao: string;
    dataCriacao: string; // Pode ser ajustado para Date se preferir
    status: string;
    cliente: ICliente;
    // Adicione outros campos necessários para a ordem de serviço
  }
  