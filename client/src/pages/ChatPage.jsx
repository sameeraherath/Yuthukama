import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatPage = () => {
  const location = useLocation();
  const postOwner = location.state?.postOwner;
  const displayName = postOwner?.username || "Unknown Author";

  const [messages, setMessages] = useState([
    {
      sender: "system",
      text: "Start chatting with " + displayName,
      timestamp: new Date(),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    setMessages([
      ...messages,
      { sender: "user", text: newMessage, timestamp: new Date() },
    ]);
    setNewMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: displayName,
          text: "Thanks for your message!",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  return (
    <Box
      sx={{ minHeight: "100vh", padding: "20px", backgroundColor: "#f0f2f5" }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 800,
          margin: "0 auto",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: "#1976d2",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar>{displayName.charAt(0)}</Avatar>
          <Typography variant="h6">Chat with {displayName}</Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                alignSelf:
                  message.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "70%",
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  backgroundColor:
                    message.sender === "user" ? "#e3f2fd" : "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                {message.sender === "system" ? (
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    {message.text}
                  </Typography>
                ) : (
                  <>
                    <Typography variant="body1">{message.text}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </>
                )}
              </Paper>
            </Box>
          ))}
        </Box>

        <Divider />

        <Stack direction="row" spacing={1} sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ChatPage;
