import { TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
