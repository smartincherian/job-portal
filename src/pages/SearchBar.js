import React, { useState } from "react";
import "./SearchBar.css";
import { jobSearch } from "../features/searchSlice";
import { useDispatch, useSelector } from "react-redux";

function SearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();

  return (
    <div className="search-bar-div">
      <input
        type="text"
        placeholder="Search for job postings by keyword or location"
        className="search"
        onChange={(e) => dispatch(jobSearch(e.target.value))}
      ></input>
    </div>
  );
}

export default SearchBar;
