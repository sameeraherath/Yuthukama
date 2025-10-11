import { TextField, Box, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { motion } from "framer-motion";

/**
 * Search bar component for filtering posts
 * @component
 * @param {Object} props - Component props
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.setSearchTerm - Function to update search term
 * @returns {JSX.Element} Search input field with icon
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
 */
const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <TextField
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          maxWidth: "700px",
          width: "100%",
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            borderRadius: "50px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
            "&:hover": {
              backgroundColor: "#f0fdf4",
              boxShadow: "0 2px 8px rgba(29, 191, 115, 0.12)",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 12px rgba(29, 191, 115, 0.15)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1DBF73",
                borderWidth: "2px",
              },
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          "& .MuiInputBase-input": {
            color: "#404145",
            fontSize: "0.95rem",
            fontWeight: 500,
            "&::placeholder": {
              color: "#95979D",
              opacity: 1,
              fontWeight: 400,
            },
          },
        }}
        placeholder="Search posts, topics, or keywords..."
        InputProps={{
          sx: {
            height: "48px",
            fontSize: "0.95rem",
            pl: 2,
            pr: 1,
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  color: "#1DBF73",
                  fontSize: "1.4rem",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                edge="end"
                size="small"
                aria-label="clear search"
                sx={{
                  color: "#95979D",
                  transition: "all 0.2s",
                  "&:hover": {
                    color: "#FF6B6B",
                    bgcolor: "rgba(255, 107, 107, 0.1)",
                  },
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
