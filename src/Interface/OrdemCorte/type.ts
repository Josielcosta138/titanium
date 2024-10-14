export interface IOrdemCorte {
    id: number;
    materiaPrima: {
        nome: string;
        comprimento: number;
        qtde: number;
        largura: number;
        codReferencia: string;
        qtdeMaterialRestante?: number;
        qtdeMaterialFalhas?: number
    };
  }
  