import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


interface ConfirmarOCProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}


export default function ConfirmarOC({ open, onClose }: ConfirmarOCProps) {
    const handleConfirm = () => {
      onClose(true); 
    };
  
    const handleCancel = () => {
      onClose(false); 
    };
  
    return (
      <Dialog
        open={open}
        onClose={handleCancel} // Fecha ao clicar fora
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Atenção!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja cadastrar Ordem de Corte?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm}>Sim</Button>
          <Button onClick={handleCancel} autoFocus>
            Não
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
