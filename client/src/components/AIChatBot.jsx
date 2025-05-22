import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";

const PRIMARY_COLOR = "#404145";
const ACCENT_COLOR = "#00b14f";
const API_URL = import.meta.env.VITE_SERVER_URL;

const AIChatBot = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    const userMsg = message;
    setChatHistory((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/api/chat/ai-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ message: userMsg }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || data.aiMessage?.text || "[No response]",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.message === "No authentication token found"
              ? "Please log in to use the chat"
              : "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{
        height: 500,
        width: 350,
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0 8px 32px 0 rgba(64,65,69,0.15)",

        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: PRIMARY_COLOR,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SmartToyIcon sx={{ color: ACCENT_COLOR }} />
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            Yuthukama Assistant
          </Typography>
        </Box>
        <IconButton color="inherit" size="small" onClick={onClose}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          bgcolor: "#f7f7f7",
        }}
      >
        {chatHistory.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              bgcolor: msg.role === "user" ? ACCENT_COLOR : "white",
              color: msg.role === "user" ? "white" : PRIMARY_COLOR,
              p: 1.5,
              borderRadius: 2,
              maxWidth: "80%",
              boxShadow: 1,
              fontSize: "1rem",
              fontWeight: msg.role === "user" ? 500 : 400,
              border:
                msg.role === "assistant"
                  ? `1.5px solid ${ACCENT_COLOR}`
                  : undefined,
            }}
          >
            <Typography>{msg.content}</Typography>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ alignSelf: "flex-start", p: 1 }}>
            <CircularProgress size={20} sx={{ color: ACCENT_COLOR }} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          display: "flex",
          gap: 1,
          bgcolor: "white",
          borderTop: `1.5px solid ${ACCENT_COLOR}`,
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
          variant="outlined"
          disabled={isLoading}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              "& fieldset": {
                borderColor: ACCENT_COLOR,
              },
              "&:hover fieldset": {
                borderColor: PRIMARY_COLOR,
              },
              "&.Mui-focused fieldset": {
                borderColor: PRIMARY_COLOR,
              },
            },
          }}
        />
        <IconButton
          type="submit"
          sx={{
            bgcolor: ACCENT_COLOR,
            color: "white",
            "&:hover": { bgcolor: PRIMARY_COLOR },
            transition: "all 0.2s",
          }}
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            <SendIcon />
          )}
        </IconButton>
      </Box>
    </Paper>
  );
};

export default AIChatBot;
