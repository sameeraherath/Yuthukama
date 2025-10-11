import { Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";

/**
 * Button component for initiating a chat with a post owner
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.user - User data of the post owner
 * @param {string} props.user._id - User ID
 * @param {string} props.user.username - Username
 * @returns {JSX.Element} Message button that navigates to chat
 * @example
 * <MessageButton user={{ _id: "123", username: "john_doe" }} />
 */
const MessageButton = ({ user }) => {
  const navigate = useNavigate();

  /**
   * Navigates to modern chat page with post owner data
   * @function
   */
  const handleClick = () => {
    navigate("/messages", {
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
