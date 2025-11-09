import { Box, Tooltip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/**
 * Message status indicator component
 * @component
 * @param {Object} props - Component props
 * @param {string} props.status - Message status ('sending', 'delivered', 'read', 'error')
 * @param {string} props.timestamp - Message timestamp
 * @param {string} props.readAt - When message was read
 * @param {string} props.readBy - Who read the message
 * @param {string} props.error - Error message if status is error
 * @returns {JSX.Element} Message status indicator
 */
const MessageStatus = ({ 
  status, 
  timestamp, 
  readAt, 
  readBy, 
  error 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
      case 'delivered':
        return <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
      case 'read':
        return <CheckCircleIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sending':
        return 'Sending...';
      case 'delivered':
        return `Delivered at ${new Date(timestamp).toLocaleTimeString()}`;
      case 'read':
        return `Read at ${new Date(readAt).toLocaleTimeString()}`;
      case 'error':
        return `Failed to send: ${error}`;
      default:
        return '';
    }
  };

  const getTooltipText = () => {
    if (status === 'read' && readBy) {
      return `Read by ${readBy} at ${new Date(readAt).toLocaleString()}`;
    }
    return getStatusText();
  };

  return (
    <Tooltip title={getTooltipText()} arrow>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
        {getStatusIcon()}
        {status === 'error' && (
          <Typography 
            variant="caption" 
            color="error" 
            sx={{ ml: 0.5, fontSize: '0.7rem' }}
          >
            Failed
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default MessageStatus;
