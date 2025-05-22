import { TextField, Box, InputAdornment, alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "24px",
        marginBottom: "24px",
        padding: "0 16px",
        width: "100%",
      }}
    >
      <TextField
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          maxWidth: "600px",
          width: "100%",
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f0fdf4",
            borderRadius: "12px",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#dcfce7",
              boxShadow: "0 2px 8px rgba(34, 197, 94, 0.1)",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#22c55e",
                borderWidth: "2px",
              },
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1fae5",
          },
          "& .MuiInputBase-input": {
            color: "#064e3b",
            "&::placeholder": {
              color: "#059669",
              opacity: 0.7,
            },
          },
        }}
        placeholder="Search for posts..."
        InputProps={{
          sx: {
            height: "48px",
            fontSize: "1rem",
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  color: "#22c55e",
                  fontSize: "1.5rem",
                }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
