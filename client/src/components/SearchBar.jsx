import { TextField, Box } from "@mui/material";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <TextField
        label="Search Posts"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ maxWidth: "500px" }}
      />
    </Box>
  );
};

export default SearchBar;
