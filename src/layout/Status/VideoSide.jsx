import React from 'react';
import ReactPlayer from 'react-player';
import { Box } from '@mui/material';

export default function VideoSide({ select }) {
  const videoUrl = select?.Status;

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        width: { xs: '100%', sm: '70%', md: '80%' },
        height: '100vh',
        borderLeft: 2,
        borderColor: 'divider',
        overflow: 'hidden',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {videoUrl ? (
        <ReactPlayer
          url={videoUrl}
          controls
          width='100%'
          height='90%'
          style={{ borderRadius: '8px' }}
        />
      ) : (
        <p>No video to display</p>
      )}
    </Box>
  );
}
