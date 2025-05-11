import { useLocation, useParams } from "react-router-dom";

const ChatPage = () => {
  const { userId } = useParams();
  const location = useLocation();
  const postOwner = location.state?.postOwner;

  const displayName = postOwner?.name || `User ID: ${userId}`;

  return (
    <div>
      <h1>Chat with {displayName}</h1>
    </div>
  );
};

export default ChatPage;
