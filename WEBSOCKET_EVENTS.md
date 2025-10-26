# WebSocket Events Documentation

This document provides comprehensive documentation for all Socket.IO events used in the Yuthukama platform for real-time communication.

## 📋 Table of Contents

- [Connection Overview](#connection-overview)
- [Authentication](#authentication)
- [Room Management](#room-management)
- [Message Events](#message-events)
- [Typing Indicators](#typing-indicators)
- [Message Reactions](#message-reactions)
- [User Status](#user-status)
- [Error Handling](#error-handling)
- [Client Implementation](#client-implementation)
- [Server Implementation](#server-implementation)

## Connection Overview

### Socket.IO Configuration

```javascript
// Client-side connection
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  autoConnect: true
});

// Server-side configuration
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://yuthukama.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  path: "/socket.io",
  connectTimeout: 10000,
  pingTimeout: 5000,
  pingInterval: 10000,
});
```

### Connection States

- **Connecting**: Initial connection attempt
- **Connected**: Successfully connected to server
- **Disconnected**: Connection lost or closed
- **Reconnecting**: Attempting to reconnect after disconnection

## Authentication

### Client to Server Events

#### `authenticate`

Authenticate user with Socket.IO connection.

**Event Data:**
```javascript
{
  userId: "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

**Client Implementation:**
```javascript
// Send authentication after successful login
socket.emit('authenticate', { userId: currentUser.id });
```

**Server Response:**
- User is added to `user_${userId}` room
- User status is tracked in active users map
- Other users are notified of user's online status

**Error Handling:**
```javascript
socket.on('auth_error', (data) => {
  console.error('Authentication failed:', data.message);
  // Handle authentication error
});
```

### Server to Client Events

#### `auth_error`

Sent when authentication fails.

**Event Data:**
```javascript
{
  message: "Authentication failed"
}
```

## Room Management

### Client to Server Events

#### `join_room`

Join a chat room/conversation.

**Event Data:**
```javascript
{
  roomId: "conversation_60f7b3b3b3b3b3b3b3b3b3b9"
}
```

**Client Implementation:**
```javascript
// Join a conversation room
socket.emit('join_room', { roomId: conversationId });
```

**Server Response:**
- User joins the specified room
- Other room members are notified

#### `leave_room`

Leave a chat room/conversation.

**Event Data:**
```javascript
{
  roomId: "conversation_60f7b3b3b3b3b3b3b3b3b3b9"
}
```

**Client Implementation:**
```javascript
// Leave a conversation room
socket.emit('leave_room', { roomId: conversationId });
```

**Server Response:**
- User leaves the specified room
- Other room members are notified

### Server to Client Events

#### `user_joined_room`

Notifies when a user joins a room.

**Event Data:**
```javascript
{
  userId: "60f7b3b3b3b3b3b3b3b3b3b3",
  roomId: "conversation_60f7b3b3b3b3b3b3b3b3b3b9",
  timestamp: "2023-07-20T18:30:00.000Z"
}
```

#### `user_left_room`

Notifies when a user leaves a room.

**Event Data:**
```javascript
{
  userId: "60f7b3b3b3b3b3b3b3b3b3b3",
  roomId: "conversation_60f7b3b3b3b3b3b3b3b3b3b9",
  timestamp: "2023-07-20T18:30:00.000Z"
}
```

## Message Events

### Client to Server Events

#### `send_message`

Send a message in a chat room.

**Event Data:**
```javascript
{
  roomId: "conversation_60f7b3b3b3b3b3b3b3b3b3b9",
  sender: "60f7b3b3b3b3b3b3b3b3b3b3",
  text: "Hello! How are you?",
  conversationId: "60f7b3b3b3b3b3b3b3b3b3b9",
  messageId: "msg_1640995200000", // Optional custom ID
  tempId: "temp_12345" // Client-side temporary ID for UI updates
}
```

**Client Implementation:**
```javascript
// Send a message
const messageData = {
  roomId: conversationId,
  sender: currentUser.id,
  text: messageText,
  conversationId: conversationId,
  tempId: `temp_${Date.now()}`
};

socket.emit('send_message', messageData);
```

**Server Response:**
- Message is saved to database
- Message is broadcast to all room members
- Delivery confirmation is sent to sender

### Server to Client Events

#### `receive_message`

Receive a new message in a room.

**Event Data:**
```javascript
{
  _id: "60f7b3b3b3b3b3b3b3b3b3ba", // Database ID
  roomId: "conversation_60f7b3b3b3b3b3b3b3b3b3b9",
  sender: "60f7b3b3b3b3b3b3b3b3b3b3",
  text: "Hello! How are you?",
  conversationId: "60f7b3b3b3b3b3b3b3b3b3b9",
  tempId: "temp_12345", // Original client temp ID
  timestamp: "2023-07-20T18:30:00.000Z",
  status: "delivered",
  sender: { // Populated sender information
    id: "60f7b3b3b3b3b3b3b3b3b3b3",
    username: "john_doe",
    profilePicture: "/uploads/profile-pics/user123.jpg"
  }
}
```

**Client Implementation:**
```javascript
socket.on('receive_message', (messageData) => {
  // Update UI with new message
  setMessages(prev => [...prev, messageData]);
  
  // Mark temp message as delivered if it exists
  if (messageData.tempId) {
    updateTempMessageStatus(messageData.tempId, 'delivered');
  }
});
```

#### `message_delivered`

Confirmation that message was delivered to server.

**Event Data:**
```javascript
{
  tempId: "temp_12345",
  messageId: "60f7b3b3b3b3b3b3b3b3b3ba",
  timestamp: "2023-07-20T18:30:00.000Z"
}
```

**Client Implementation:**
```javascript
socket.on('message_delivered', (data) => {
  // Update message status in UI
  updateMessageStatus(data.tempId, 'delivered', data.messageId);
});
```

#### `message_error`

Error occurred while sending message.

**Event Data:**
```javascript
{
  tempId: "temp_12345",
  error: "Failed to send message"
}
```

**Client Implementation:**
```javascript
socket.on('message_error', (data) => {
  // Show error message to user
  updateMessageStatus(data.tempId, 'error');
  showErrorMessage(data.error);
});
```

## Typing Indicators

### Client to Server Events

#### `typing`

Indicate that user is typing.

**Event Data:**
```javascript
{
  roomId: "conversation_60f7b3b3b3b3b3b3b3b3b3b9",
  userId: "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

**Client Implementation:**
```javascript
// Start typing indicator
let typingTimer;

const handleTyping = () => {
  socket.emit('typing', {
    roomId: conversationId,
    userId: currentUser.id
  });
  
  // Clear existing timer
  clearTimeout(typingTimer);
  
  // Set timer to stop typing after 3 seconds
  typingTimer = setTimeout(() => {
    socket.emit('stop_typing', {
      roomId: conversationId,
      userId: currentUser.id
    });
  }, 3000);
};

// Call on input change
messageInput.addEventListener('input', handleTyping);
```

#### `stop_typing`

Indicate that user stopped typing.

**Event Data:**
```javascript
{
  roomId: "conversation_60f7b3b3b3b3b3b3b3b3b3b9",
  userId: "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

**Client Implementation:**
```javascript
// Stop typing indicator
socket.emit('stop_typing', {
  roomId: conversationId,
  userId: currentUser.id
});
```

### Server to Client Events

#### `typing`

Receive typing indicator from another user.

**Event Data:**
```javascript
{
  roomId: "conversation_60f7b3b3b3b3b3b3b3b3b3b9",
  userId: "60f7b3b3b3b3b3b3b3b3b3b3",
  timestamp: "2023-07-20T18:30:00.000Z"
}
```

**Client Implementation:**
```javascript
socket.on('typing', (data) => {
  // Show typing indicator for user
  setTypingUsers(prev => ({
    ...prev,
    [data.userId]: data.timestamp
  }));
});
```

#### `stop_typing`

Receive stop typing indicator from another user.

**Event Data:**
```javascript
{
  roomId: "conversation_60f7b3b3b3b3b3b3b3b3b3b9",
  userId: "60f7b3b3b3b3b3b3b3b3b3b3",
  timestamp: "2023-07-20T18:30:00.000Z"
}
```

**Client Implementation:**
```javascript
socket.on('stop_typing', (data) => {
  // Remove typing indicator for user
  setTypingUsers(prev => {
    const updated = { ...prev };
    delete updated[data.userId];
    return updated;
  });
});
```

## Message Reactions

### Client to Server Events

#### `add_reaction`

Add a reaction to a message.

**Event Data:**
```javascript
{
  messageId: "60f7b3b3b3b3b3b3b3b3b3ba",
  reaction: "👍",
  userId: "60f7b3b3b3b3b3b3b3b3b3b3",
  roomId: "conversation_60f7b3b3b3b3b3b3b3b3b3b9"
}
```

**Client Implementation:**
```javascript
// Add reaction to message
socket.emit('add_reaction', {
  messageId: messageId,
  reaction: reactionEmoji,
  userId: currentUser.id,
  roomId: conversationId
});
```

### Server to Client Events

#### `message_reaction`

Receive message reaction update.

**Event Data:**
```javascript
{
  messageId: "60f7b3b3b3b3b3b3b3b3b3ba",
  reaction: "👍",
  userId: "60f7b3b3b3b3b3b3b3b3b3b3",
  timestamp: "2023-07-20T18:30:00.000Z"
}
```

**Client Implementation:**
```javascript
socket.on('message_reaction', (data) => {
  // Update message reactions in UI
  updateMessageReaction(data.messageId, data.userId, data.reaction);
});
```

## Message Read Receipts

### Client to Server Events

#### `mark_message_read`

Mark a message as read.

**Event Data:**
```javascript
{
  messageId: "60f7b3b3b3b3b3b3b3b3b3ba",
  conversationId: "60f7b3b3b3b3b3b3b3b3b3b9"
}
```

**Client Implementation:**
```javascript
// Mark message as read when user views it
socket.emit('mark_message_read', {
  messageId: messageId,
  conversationId: conversationId
});
```

### Server to Client Events

#### `message_read`

Notification that a message was read by recipient.

**Event Data:**
```javascript
{
  messageId: "60f7b3b3b3b3b3b3b3b3b3ba",
  readBy: "60f7b3b3b3b3b3b3b3b3b3b4",
  readAt: "2023-07-20T18:30:00.000Z"
}
```

**Client Implementation:**
```javascript
socket.on('message_read', (data) => {
  // Update message read status in UI
  updateMessageReadStatus(data.messageId, data.readBy, data.readAt);
});
```

## User Status

### Server to Client Events

#### `user_status_change`

Notification of user online/offline status change.

**Event Data:**
```javascript
{
  userId: "60f7b3b3b3b3b3b3b3b3b3b3",
  status: "online", // or "offline"
  timestamp: "2023-07-20T18:30:00.000Z"
}
```

**Client Implementation:**
```javascript
socket.on('user_status_change', (data) => {
  // Update user status in UI
  updateUserStatus(data.userId, data.status, data.timestamp);
});
```

## Error Handling

### Connection Errors

```javascript
// Handle connection errors
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // Show error message to user
  showConnectionError('Failed to connect to server');
});

// Handle disconnection
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  
  if (reason === 'io server disconnect') {
    // Server disconnected the client
    showErrorMessage('Disconnected by server');
  } else {
    // Client disconnected or network issue
    showReconnectingMessage('Reconnecting...');
  }
});

// Handle reconnection
socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
  hideReconnectingMessage();
});
```

### Message Errors

```javascript
// Handle message sending errors
socket.on('message_error', (data) => {
  console.error('Message error:', data.error);
  
  // Update UI to show error state
  updateMessageStatus(data.tempId, 'error');
  
  // Show user-friendly error message
  showToast('Failed to send message. Please try again.', 'error');
});
```

## Client Implementation

### Complete Socket.IO Client Setup

```javascript
import io from 'socket.io-client';
import { useAuth } from './hooks/useAuth';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(userId) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true,
    });

    this.setupEventListeners();
    this.authenticate(userId);
  }

  setupEventListeners() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleConnectionError();
    });

    // Authentication events
    this.socket.on('auth_error', (data) => {
      console.error('Authentication failed:', data.message);
    });

    // Message events
    this.socket.on('receive_message', (data) => {
      this.handleReceiveMessage(data);
    });

    this.socket.on('message_delivered', (data) => {
      this.handleMessageDelivered(data);
    });

    this.socket.on('message_error', (data) => {
      this.handleMessageError(data);
    });

    // Typing events
    this.socket.on('typing', (data) => {
      this.handleTyping(data);
    });

    this.socket.on('stop_typing', (data) => {
      this.handleStopTyping(data);
    });

    // Reaction events
    this.socket.on('message_reaction', (data) => {
      this.handleMessageReaction(data);
    });

    // Read receipt events
    this.socket.on('message_read', (data) => {
      this.handleMessageRead(data);
    });

    // User status events
    this.socket.on('user_status_change', (data) => {
      this.handleUserStatusChange(data);
    });
  }

  authenticate(userId) {
    if (this.socket?.connected) {
      this.socket.emit('authenticate', { userId });
    }
  }

  joinRoom(roomId) {
    this.socket.emit('join_room', { roomId });
  }

  leaveRoom(roomId) {
    this.socket.emit('leave_room', { roomId });
  }

  sendMessage(messageData) {
    this.socket.emit('send_message', messageData);
  }

  addReaction(messageId, reaction, userId, roomId) {
    this.socket.emit('add_reaction', {
      messageId,
      reaction,
      userId,
      roomId
    });
  }

  markMessageRead(messageId, conversationId) {
    this.socket.emit('mark_message_read', {
      messageId,
      conversationId
    });
  }

  startTyping(roomId, userId) {
    this.socket.emit('typing', { roomId, userId });
  }

  stopTyping(roomId, userId) {
    this.socket.emit('stop_typing', { roomId, userId });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Event handlers (implement based on your app's needs)
  handleReceiveMessage(data) {
    // Update messages state
  }

  handleMessageDelivered(data) {
    // Update message status
  }

  handleMessageError(data) {
    // Show error message
  }

  handleTyping(data) {
    // Show typing indicator
  }

  handleStopTyping(data) {
    // Hide typing indicator
  }

  handleMessageReaction(data) {
    // Update message reactions
  }

  handleMessageRead(data) {
    // Update read status
  }

  handleUserStatusChange(data) {
    // Update user status
  }

  handleConnectionError() {
    // Handle connection errors
  }
}

// Export singleton instance
export const socketService = new SocketService();
```

### React Hook for Socket.IO

```javascript
import { useEffect, useRef, useState } from 'react';
import { socketService } from '../services/socketService';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [userStatuses, setUserStatuses] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      socketService.connect(user.id);
      setIsConnected(socketService.isConnected);
    }

    return () => {
      socketService.disconnect();
    };
  }, [user?.id]);

  const sendMessage = (messageData) => {
    socketService.sendMessage(messageData);
  };

  const joinRoom = (roomId) => {
    socketService.joinRoom(roomId);
  };

  const leaveRoom = (roomId) => {
    socketService.leaveRoom(roomId);
  };

  const addReaction = (messageId, reaction) => {
    socketService.addReaction(messageId, reaction, user.id, currentRoomId);
  };

  const markMessageRead = (messageId, conversationId) => {
    socketService.markMessageRead(messageId, conversationId);
  };

  const startTyping = (roomId) => {
    socketService.startTyping(roomId, user.id);
  };

  const stopTyping = (roomId) => {
    socketService.stopTyping(roomId, user.id);
  };

  return {
    isConnected,
    messages,
    typingUsers,
    userStatuses,
    sendMessage,
    joinRoom,
    leaveRoom,
    addReaction,
    markMessageRead,
    startTyping,
    stopTyping,
  };
};
```

## Server Implementation

### Socket.IO Server Setup

```javascript
import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://yuthukama.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  path: "/socket.io",
  connectTimeout: 10000,
  pingTimeout: 5000,
  pingInterval: 10000,
});

// Store active users
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Authentication
  socket.on('authenticate', async (userId) => {
    try {
      socket.userId = userId;
      socket.join(`user_${userId}`);
      
      // Track active user
      activeUsers.set(userId, {
        socketId: socket.id,
        lastSeen: new Date(),
        status: 'online'
      });

      // Notify other users
      socket.broadcast.emit('user_status_change', {
        userId,
        status: 'online',
        timestamp: new Date()
      });

      console.log(`User ${userId} authenticated with socket ${socket.id}`);
    } catch (error) {
      console.error('Error authenticating user:', error);
      socket.emit('auth_error', { message: 'Authentication failed' });
    }
  });

  // Room management
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
    
    socket.to(roomId).emit('user_joined_room', {
      userId: socket.userId,
      roomId,
      timestamp: new Date()
    });
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
    
    socket.to(roomId).emit('user_left_room', {
      userId: socket.userId,
      roomId,
      timestamp: new Date()
    });
  });

  // Message handling
  socket.on('send_message', async (messageData) => {
    try {
      const { roomId, sender, text, conversationId, messageId, tempId } = messageData;

      if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
        const newMessage = new Message({
          conversationId,
          sender,
          text,
          read: false,
          messageId: messageId || `${sender}_${Date.now()}`,
        });
        await newMessage.save();

        await newMessage.populate("sender", "username profilePicture");

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: text,
          lastMessageTimestamp: new Date(),
        });

        // Create notification
        const conversation = await Conversation.findById(conversationId);
        const recipient = conversation.participants.find(
          (p) => p.toString() !== sender
        );

        if (recipient) {
          await notificationController.createNotification({
            recipient,
            sender,
            type: "message",
            content: "sent you a message",
          });
        }

        // Broadcast message
        io.in(roomId).emit('receive_message', {
          ...messageData,
          _id: newMessage._id,
          tempId,
          timestamp: newMessage.createdAt,
          status: 'delivered',
          sender: newMessage.sender
        });

        // Send delivery confirmation
        socket.emit('message_delivered', {
          tempId,
          messageId: newMessage._id,
          timestamp: newMessage.createdAt
        });

        console.log(`Message sent to room ${roomId}: ${text}`);
      }
    } catch (error) {
      console.error('Error saving message:', error);
      
      socket.emit('message_error', {
        tempId: messageData.tempId,
        error: 'Failed to send message'
      });
    }
  });

  // Typing indicators
  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('typing', {
      ...data,
      timestamp: new Date()
    });
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.roomId).emit('stop_typing', {
      ...data,
      timestamp: new Date()
    });
  });

  // Message reactions
  socket.on('add_reaction', async (data) => {
    try {
      const { messageId, reaction, userId, roomId } = data;
      
      if (messageId && mongoose.Types.ObjectId.isValid(messageId)) {
        const message = await Message.findById(messageId);
        if (message) {
          if (!message.reactions) {
            message.reactions = [];
          }
          
          const existingReaction = message.reactions.find(r => r.userId.toString() === userId);
          if (existingReaction) {
            existingReaction.reaction = reaction;
          } else {
            message.reactions.push({ userId, reaction, timestamp: new Date() });
          }
          
          await message.save();
          
          io.in(roomId).emit('message_reaction', {
            messageId,
            reaction,
            userId,
            timestamp: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  });

  // Read receipts
  socket.on('mark_message_read', async (data) => {
    try {
      const { messageId, conversationId } = data;
      
      if (messageId && mongoose.Types.ObjectId.isValid(messageId)) {
        await Message.findByIdAndUpdate(messageId, {
          read: true,
          readAt: new Date()
        });

        const message = await Message.findById(messageId);
        if (message && message.sender.toString() !== socket.userId) {
          io.to(`user_${message.sender}`).emit('message_read', {
            messageId,
            readBy: socket.userId,
            readAt: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  });

  // Disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.userId) {
      activeUsers.delete(socket.userId);
      
      socket.broadcast.emit('user_status_change', {
        userId: socket.userId,
        status: 'offline',
        timestamp: new Date()
      });
    }
  });
});

export { io };
```

---

This documentation covers all Socket.IO events used in the Yuthukama platform. For implementation examples and best practices, refer to the client and server code in the repository.
