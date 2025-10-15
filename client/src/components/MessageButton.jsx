import { Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getOrCreateConversation } from "../features/chat/chatSlice";

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
  const dispatch = useDispatch();

  /**
   * Navigates to chat with post owner by creating or finding conversation
   * @function
   */
  const handleClick = async () => {
    try {
      // Get or create conversation with the post owner
      const conversation = await dispatch(getOrCreateConversation(user._id)).unwrap();
      
      // Navigate to the conversation
      navigate(`/messages/${conversation._id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      // Fallback: navigate to messages page with state
      navigate("/messages", {
        state: {
          postOwner: user,
        },
      });
    }
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
        borderColor: "#1DBF73",
        color: "#1DBF73",
        width: "132px",
        height: "48px",
        fontSize: "16px",
        "&:hover": {
          borderColor: "#18a364",
          backgroundColor: "rgba(29, 191, 115, 0.04)",
        },
      }}
    >
      Message
    </Button>
  );
};

export default MessageButton;
