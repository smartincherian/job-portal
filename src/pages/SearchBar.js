import React from "react";
import "./SearchBar.css";
import { TextField } from "@mui/material";

function SearchBar() {
  return (
    <div className="search-bar-div">
      <div className="search-bar">
        <TextField variant="standard"></TextField>
      </div>
      <div className="search-bar-button">
        <button type="submit" className="search-button">
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
