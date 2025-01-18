// ErrorModal.js
import React, {useEffect} from 'react';
import {Modal, Box, Typography} from '@mui/material';
import './ErrorModal.scss'

const ErrorModal = ({open, message, onClose}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer); // очистим таймер при закрытии модалки
    }
  }, [open, onClose]);
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="error-modal-title" aria-describedby="error-modal-description">
      <Box className="error-modal-box">
        <Typography id="error-modal-description" sx={{mt: 2}}>
          {message}
        </Typography>
      </Box>
    </Modal>
  );
};
export default ErrorModal;

  