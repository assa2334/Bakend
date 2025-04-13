import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Typography,
  Avatar,
  Box
} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';

const CallNotification = ({ open, caller, callType, onAccept, onReject }) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Incoming {callType === 'video' ? 'Video' : 'Voice'} Call</DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Avatar 
          src={caller?.avatar} 
          sx={{ 
            width: 80, 
            height: 80, 
            margin: '0 auto 16px',
            border: '2px solid',
            borderColor: callType === 'video' ? 'primary.main' : 'secondary.main'
          }} 
        />
        <Typography variant="h6">{caller?.name}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
          {callType === 'video' ? <VideocamIcon color="primary" /> : <MicIcon color="secondary" />}
          <Typography>
            {callType === 'video' ? 'Video Call' : 'Voice Call'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', padding: 3 }}>
        <Button 
          variant="contained" 
          color="error" 
          onClick={onReject}
          sx={{ marginRight: 2 }}
          size="large"
        >
          Reject
        </Button>
        <Button 
          variant="contained" 
          color="success" 
          onClick={onAccept}
          size="large"
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CallNotification;