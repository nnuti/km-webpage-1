import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function SnackbarSuccessComponent(props:any) {

    const {open,setOpen} = props;

    const handleClose = () =>{
        setOpen(!open)
    }


  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ width: '100%', backgroundImage: "linear-gradient(to right bottom, #2D81C6, #2b82c5, #2b82c5, #3ea0c3, #4AB7C0)", color: "white", borderRadius: '16px' }}
      >
        This is a Update success!
      </Alert>
    </Snackbar>
  );
}
