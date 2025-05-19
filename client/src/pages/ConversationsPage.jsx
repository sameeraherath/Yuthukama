import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { fetchConversations } from "../features/chat/chatSlice";
import GlobalLoadingSpinner from "../components/GlobalLoadingSpinner";

/**
 * Conversations page component that displays a list of user conversations
 * @component
 * @returns {JSX.Element} List of conversations with search functionality
 * @example
 * // In App.jsx
 * <Route path="/conversations" element={<ConversationsPage />} />
 */
const ConversationsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { conversations, error } = useSelector((state) => state.chat);

  /**
   * Effect hook to fetch conversations on component mount
   * @effect
   * @listens {dispatch} - Redux dispatch function
   */
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  /**
   * Navigates to chat page for selected conversation
   * @function
   * @param {string} conversationId - ID of the selected conversation
   */
  const handleConversationClick = (conversationId) => {
    navigate(`/chat/${conversationId}`);
  };

  /**
   * Filters conversations based on search query
   * @type {Array<Object>}
   * @property {string} _id - Conversation ID
   * @property {Array<Object>} participants - Conversation participants
   * @property {Object} lastMessage - Last message in conversation
   */
  const filteredConversations = conversations.filter((conversation) =>
    conversation.participants[0]?.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalLoadingSpinner actions={["chat/fetchConversations"]} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-[#404145] mb-2">Messages</h1>
          <p className="text-gray-600 mb-6">
            Connect with your friends and colleagues
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1DBF73] focus:ring-2 focus:ring-[#1DBF73]/20 transition-all duration-200 outline-none"
            />
            <svg
              className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Conversations List */}
          <div className="space-y-3">
            {error ? (
              <div className="text-center py-12 text-red-500">
                Error loading conversations: {error}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-[#404145]">
                  No conversations
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start a new conversation to connect with others.
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => handleConversationClick(conversation._id)}
                  className="bg-white p-4 rounded-lg border border-gray-100 hover:border-[#1DBF73] cursor-pointer transition-all duration-200 hover:shadow-md group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {conversation.participants[0]?.profilePicture ? (
                          <img
                            src={conversation.participants[0].profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-xl">
                            {conversation.participants[0]?.username
                              ?.charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#1DBF73] border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-[#404145] group-hover:text-[#1DBF73] transition-colors">
                          {conversation.participants[0]?.username}
                        </h3>
                        {conversation.lastMessage?.createdAt && (
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(
                              new Date(conversation.lastMessage.createdAt),
                              { addSuffix: true }
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage;
