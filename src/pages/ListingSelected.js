import React from "react";
import { NavBarUser } from "../components/NavBarUser";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import "./ListingSelected.css";

function ListingSelected() {
  const listingSelected = useSelector(
    (state) => state.listings.listingSelected
  );
  console.log(listingSelected);

  return (
    <div>
      <NavBarUser />

      {/* selected listing details */}

      <Grid container justifyContent="center" className="listing-container">
        <Grid item xs={8} className="listing-grid-item">
          <h2>{listingSelected.title}</h2>
        </Grid>
      </Grid>
    </div>
  );
}

export default ListingSelected;
