import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import {
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  AudioFile as AudioIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

/**
 * MessageAttachment component - Displays file attachments in messages
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.attachment - Attachment data
 * @param {string} props.attachment.url - Attachment URL
 * @param {string} props.attachment.type - Attachment type (image/video/audio/file)
 * @param {string} props.attachment.filename - Original filename
 * @param {number} props.attachment.size - File size in bytes
 * @returns {JSX.Element} Attachment display
 */
const MessageAttachment = ({ attachment }) => {
  if (!attachment || !attachment.url) {
    return null;
  }

  const { url, type, filename, size } = attachment;

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const renderAttachment = () => {
    switch (type) {
      case "image":
        return (
          <Box
            component="img"
            src={url}
            alt={filename}
            sx={{
              maxWidth: "100%",
              maxHeight: 300,
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": {
                opacity: 0.9,
              },
            }}
            onClick={() => window.open(url, "_blank")}
          />
        );

      case "video":
        return (
          <Box
            component="video"
            controls
            src={url}
            sx={{
              maxWidth: "100%",
              maxHeight: 300,
              borderRadius: 2,
            }}
          >
            Your browser does not support the video tag.
          </Box>
        );

      case "audio":
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
            <AudioIcon sx={{ color: "#1DBF73" }} />
            <Box component="audio" controls src={url} sx={{ flexGrow: 1 }}>
              Your browser does not support the audio tag.
            </Box>
          </Box>
        );

      case "file":
      default:
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: 2,
              maxWidth: 300,
            }}
          >
            <FileIcon sx={{ color: "#1DBF73", fontSize: 32 }} />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {filename}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(size)}
              </Typography>
            </Box>
            <IconButton
              size="small"
              component="a"
              href={url}
              download={filename}
              target="_blank"
              sx={{
                color: "#1DBF73",
                "&:hover": {
                  backgroundColor: "rgba(29, 191, 115, 0.1)",
                },
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Box>
        );
    }
  };

  return <Box sx={{ mt: 1, mb: 0.5 }}>{renderAttachment()}</Box>;
};

export default MessageAttachment;
