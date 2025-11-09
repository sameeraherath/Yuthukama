import React, { useState} from 'react';
import { Box, Typography, Button, Paper, TextField } from '@mui/material';
import { useSelector} from 'react-redux';
import useChat from '../hooks/useChat';


/**
 * WebSocket Test Component
 * @component
 * @returns {JSX.Element} Test interface for WebSocket functionality
 */
const WebSocketTest = () => {
  const { user } = useSelector((state) => state.auth);
  const { messages, userStatus } = useSelector((state) => state.chat);

  
  const [testMessage, setTestMessage] = useState('');
  const [testUserId] = useState('test_user_123');
  
  const {
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    isTyping,
    connectionError,
    addReactionToMessage,
  } = useChat(user?._id, testUserId, 'test_conversation');

  const handleSendTestMessage = () => {
    if (testMessage.trim() && isConnected) {
      const messageData = sendMessage(testMessage.trim());
      if (messageData) {
        console.log('Test message sent:', messageData);
        setTestMessage('');
      }
    }
  };

  const handleAddReaction = () => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      addReactionToMessage(lastMessage._id, '👍');
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        WebSocket Test Interface
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          Connection Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}
        </Typography>
        {connectionError && (
          <Typography variant="body2" color="error">
            Error: {connectionError}
          </Typography>
        )}
        <Typography variant="body2">
          Typing Status: {isTyping ? '👤 User is typing...' : '💤 Not typing'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Test Message"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendTestMessage();
            }
          }}
          sx={{ mb: 1 }}
        />
        <Button 
          variant="contained" 
          onClick={handleSendTestMessage}
          disabled={!isConnected || !testMessage.trim()}
        >
          Send Test Message
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Button 
          variant="outlined" 
          onClick={startTyping}
          sx={{ mr: 1 }}
        >
          Start Typing
        </Button>
        <Button 
          variant="outlined" 
          onClick={stopTyping}
          sx={{ mr: 1 }}
        >
          Stop Typing
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleAddReaction}
        >
          Add Reaction
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Recent Messages:</Typography>
        {messages.slice(-5).map((message, index) => (
          <Box key={index} sx={{ p: 1, border: '1px solid #ccc', mb: 1 }}>
            <Typography variant="body2">
              <strong>{message.sender === user?._id ? 'You' : 'Other'}:</strong> {message.text}
            </Typography>
            <Typography variant="caption">
              Status: {message.status || 'unknown'} | 
              Time: {new Date(message.timestamp).toLocaleTimeString()}
            </Typography>
            {message.reactions && message.reactions.length > 0 && (
              <Typography variant="caption">
                Reactions: {message.reactions.map(r => r.reaction).join(' ')}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Box>
        <Typography variant="h6">User Status:</Typography>
        {Object.entries(userStatus).map(([userId, status]) => (
          <Typography key={userId} variant="body2">
            {userId}: {status.status} (last seen: {new Date(status.timestamp).toLocaleTimeString()})
          </Typography>
        ))}
      </Box>
    </Paper>
  );
};

export default WebSocketTest;
