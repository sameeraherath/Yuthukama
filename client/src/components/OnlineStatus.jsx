import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useSelector } from 'react-redux';

/**
 * Online status indicator component
 * @component
 * @param {Object} props - Component props
 * @param {string} props.userId - ID of the user to show status for
 * @param {string} props.username - Username to display
 * @param {boolean} props.showText - Whether to show status text
 * @returns {JSX.Element} Online status indicator
 */
const OnlineStatus = ({ userId, username, showText = false }) => {
  const { userStatus } = useSelector((state) => state.chat);
  
  const userStatusData = userStatus[userId];
  const isOnline = userStatusData?.status === 'online';
  const lastSeen = userStatusData?.timestamp;

  const getStatusText = () => {
    if (isOnline) {
      return 'Online';
    }
    if (lastSeen) {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
      
      if (diffMinutes < 1) {
        return 'Just now';
      } else if (diffMinutes < 60) {
        return `${diffMinutes} minutes ago`;
      } else if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffMinutes / 1440);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
    }
    return 'Offline';
  };

  const getStatusColor = () => {
    if (isOnline) {
      return '#4caf50'; // Green for online
    }
    return '#9e9e9e'; // Gray for offline
  };

  return (
    <Tooltip title={getStatusText()} arrow>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <CircleIcon 
          sx={{ 
            fontSize: 8, 
            color: getStatusColor(),
            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))'
          }} 
        />
        {showText && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.7rem'
            }}
          >
            {getStatusText()}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default OnlineStatus;
