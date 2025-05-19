import { Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";

const MessageButton = ({ user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chat", {
      state: {
        postOwner: user,
      },
    });
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      size="small"
      startIcon={<ChatIcon />}
      onClick={handleClick}
      sx={{
        borderRadius: 3,
        textTransform: "none",
        borderColor: "#1ac173",
        color: "#1ac173",
        width: "132px",
        height: "48px",
        fontSize: "16px",
        "&:hover": {
          borderColor: "#17a061",
          backgroundColor: "rgba(26, 193, 115, 0.04)",
        },
      }}
    >
      Message
    </Button>
  );
};

export default MessageButton;
