import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

const SwipeableAlert = ({ open, handleClose, severity, message }) => {
  // Define the transition function
  const SlideTransition = (props) => {
    return <Slide {...props} direction="left" />;
  };

  console.log('open =======>', open)
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={6000}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SwipeableAlert;