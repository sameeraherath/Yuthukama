import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Popover, Typography, Chip } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Message reactions component
 * @component
 * @param {Object} props - Component props
 * @param {string} props.messageId - ID of the message
 * @param {Array} props.reactions - Array of reactions on the message
 * @param {Function} props.onAddReaction - Function to add a reaction
 * @returns {JSX.Element} Message reactions component
 */
const MessageReactions = ({ messageId, reactions = [], onAddReaction }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const handleReactionClick = (reaction) => {
    onAddReaction(messageId, reaction);
    setAnchorEl(null);
  };

  const handleOpenReactions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseReactions = () => {
    setAnchorEl(null);
  };

  const getReactionCounts = () => {
    const counts = {};
    reactions.forEach(reaction => {
      counts[reaction.reaction] = (counts[reaction.reaction] || 0) + 1;
    });
    return counts;
  };

  const reactionCounts = getReactionCounts();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
      {/* Display existing reactions */}
      {Object.entries(reactionCounts).map(([reaction, count]) => (
        <Chip
          key={reaction}
          label={`${reaction} ${count}`}
          size="small"
          variant="outlined"
          sx={{ 
            fontSize: '0.75rem',
            height: 24,
            '& .MuiChip-label': {
              px: 0.5
            }
          }}
          onClick={() => handleReactionClick(reaction)}
        />
      ))}

      {/* Add reaction button */}
      <Tooltip title="Add reaction">
        <IconButton
          size="small"
          onClick={handleOpenReactions}
          sx={{ 
            width: 24, 
            height: 24,
            opacity: 0.7,
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <EmojiEmotionsIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      {/* Reaction picker popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseReactions}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 1, display: 'flex', gap: 0.5 }}>
          {commonReactions.map((reaction) => (
            <Tooltip key={reaction} title={reaction}>
              <IconButton
                size="small"
                onClick={() => handleReactionClick(reaction)}
                sx={{ 
                  fontSize: '1.2rem',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                {reaction}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Popover>
    </Box>
  );
};

export default MessageReactions;
