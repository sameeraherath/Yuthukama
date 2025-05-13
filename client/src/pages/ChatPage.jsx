import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../features/chat/chatSlice";
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

  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    dispatch(
      addMessage({ sender: "user", text: newMessage, timestamp: new Date() })
    );
    setNewMessage("");

    setTimeout(() => {
      dispatch(
        addMessage({
          sender: displayName,
          text: "Thanks for your message!",
          timestamp: new Date(),
        })
      );
    }, 1000);
  };

  const renderMessage = (message, index) => (
    <Box
      key={index}
      sx={{
        alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
        maxWidth: "70%",
      }}
    >
      <Paper
        sx={{
          p: 1.5,
          backgroundColor: message.sender === "user" ? "#e3f2fd" : "#f5f5f5",
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
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", padding: "20px" }}>
      {" "}
      <Paper
        elevation={3}
        sx={{
          maxWidth: 800,
          margin: "0 auto",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {" "}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#1ac173",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
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
          {messages.map(renderMessage)}
        </Box>
        <Divider />{" "}
        <Stack direction="row" spacing={1} sx={{ p: 2 }}>
          {" "}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                "&.Mui-focused fieldset": {
                  borderColor: "#1ac173",
                  borderWidth: 2,
                },
              },
            }}
          />{" "}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1ac173",
              borderRadius: 3,
              padding: "8px 16px",
            }}
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
