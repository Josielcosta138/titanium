import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';

interface ConfirmarOCProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}


const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: '#ed6c02',
  color: '#ffffff', 
  padding: theme.spacing(2),
  width: '100%',
  height: '50%',
  margin: '0 auto', 
}));
const CustomDialogContentText = styled(DialogContentText)({
  marginTop: '30px',
  fontSize: '1.2rem', 
  color: 'blue',
});


export default function ConfirmarFinalizarOS({ open, onClose }: ConfirmarOCProps) {
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
        <CustomDialogTitle id="alert-dialog-title">
        {"Atenção!"}
      </CustomDialogTitle>
        <DialogContent>
          <CustomDialogContentText id="alert-dialog-description">
            Deseja realmente finalizar a Ordem de serviço?
          </CustomDialogContentText>
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
