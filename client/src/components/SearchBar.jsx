import { TextField, Box, InputAdornment } from "@mui/material";
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
        marginTop: "20px",
        marginBottom: "20px",
        padding: "10px",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      <TextField
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ maxWidth: "400px", borderRadius: "20px" }}
        placeholder="Search for a post"
        InputProps={{
          sx: { borderRadius: "40px" },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="medium" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
