// Código 1 atualizado com a lista de clientes do Código 2

import React, { useState, useEffect } from 'react';
import './index.css';
import { apiGet, STATUS_CODE } from '../../api/RestClient';
import { Box, Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IClientes } from '../../Interface/Cliente/type';
import jsPDF from 'jspdf';

interface Corte {
  ordemId: number;
  cliente: string;
  referencia: string;
  tipoDeTecido: string;
  quantidadeDeRolo: number;
  grade: string;
  dataDeChegada: string;
}

const TelaInicial: React.FC = () => {
  const [cortes] = useState<Corte[]>([
    {
      ordemId: 59217,
      cliente: 'La Moda',
      referencia: 'DB05475',
      tipoDeTecido: 'Malha',
      quantidadeDeRolo: 32,
      grade: '1M - 2G - 2GG',
      dataDeChegada: '25/12/2024',
    },
    {
      ordemId: 59217,
      cliente: 'La Moda',
      referencia: 'DB05475',
      tipoDeTecido: 'Poliester',
      quantidadeDeRolo: 12,
      grade: '1M - 2G - 2GG',
      dataDeChegada: '25/12/2024',
    },
    // ... outros cortes
  ]);

  const [clientes, setClientes] = useState<IClientes[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [page, setPage] = useState(1); // Estado para controle da página
  const [totalPages, setTotalPages] = useState(1); // Estado para controle do total de páginas
  const navigate = useNavigate(); 

  const carregarClientes = async () => {
    try {
      const response = await apiGet(`endereco/carregar`);
      if (response.status === STATUS_CODE.OK) {
        setClientes(response.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  const handleVerMais = (cliente: IClientes) => {
    setSelectedCliente(cliente);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCliente(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    carregarClientes();
  }, [page]);

  const editarCliente = (id: number) => {
    navigate(`/ordemCliente/${id}`);
  }

  

  return (
    <div className="container">
      <aside className="sidebar">
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
      </aside>
      <main className="content">
        <div className="dashboard">
          <div className="card blue">
            <span>CORTES GERADOS</span>
            <h1>243</h1>
          </div>
          <div className="card gray">
            <span>CLIENTES CADASTRADOS</span>
            <h1>13</h1>
          </div>
          <div className="card orange">
            <span>FATURAMENTO TOTAL</span>
            <h1>R$ 15.556,00</h1>
          </div>
          <div className="card orange-light">
            <span>USUÁRIOS CADASTRADOS</span>
            <h1>3</h1>
          </div>
        </div>
        <div className="button-container">
          <button onClick={() => {
           
            console.log('Botão Ordem de Serviço clicado!');
          }}>Ordem de Serviço</button>
          <button onClick={() => {
           
            console.log('Botão Lista de Serviço clicado!');
          }}>Lista de Serviço</button>
          <button onClick={() => {
           
            console.log('Botão Clientes clicado!');
          }}>Clientes</button>
          <button onClick={() => {
          
            console.log('Botão Relatórios clicado!');
          }}>Relatórios</button>
        </div>
        <div className="table-container">
          <h2>Clientes</h2>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Cidade</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.client?.id}>
                    <TableCell>{cliente.client?.nomeFantasia}</TableCell>
                    <TableCell>{cliente.client?.email}</TableCell>
                    <TableCell>{cliente.client?.telefone}</TableCell>
                    <TableCell>{cliente.cidades?.name}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleVerMais(cliente)}>Ver Mais</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="pagination">
            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>&lt;</Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button key={index} onClick={() => handlePageChange(index + 1)} className={page === index + 1 ? 'active' : ''}>
                {index + 1}
              </Button>
            ))}
            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>&gt;</Button>
          </div>
        </div>
        <Modal open={open} onClose={handleClose}>
          <Box className="modal-box">
            <Typography variant="h6" component="h2">Detalhes do Cliente</Typography>
            {selectedCliente && (
              <>
                <Typography variant="body1"><strong>Nome:</strong> {selectedCliente.client?.nomeFantasia}</Typography>
                <Typography variant="body1"><strong>Email:</strong> {selectedCliente.client?.email}</Typography>
                <Typography variant="body1"><strong>Telefone:</strong> {selectedCliente.client?.telefone}</Typography>
                <Typography variant="body1"><strong>Cidade:</strong> {selectedCliente.cidades?.name}</Typography>
                <Typography variant="body1"><strong>Endereço:</strong> {selectedCliente.rua}, {selectedCliente.bairro}</Typography>
              </>
            )}
          </Box>
        </Modal>
      </main>
    </div>
  );
};

export default TelaInicial; 
