export interface IEnderecos {
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
}