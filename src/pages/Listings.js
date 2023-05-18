import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import "./Listings.css";
import { NavBarUser } from "../components/NavBarUser";
import { useDispatch, useSelector } from "react-redux";
import { jobListingSelected, jobListings } from "../features/jobListingsSlice";
import axios from "axios";
import { ButtonBase } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function Listings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobListings();
  }, []);

  const fetchJobListings = async () => {
    axios.get("./joblistings.json").then((res) => {
      dispatch(jobListings(res.data));
    });
  };

  const { listings } = useSelector((state) => state.listings);
  // console.log(listings);

  const listingClickHandler = (listing) => {
    dispatch(jobListingSelected(listing));
    navigate(`${listing.jobId}`);
  };

  return (
    <div className="listings-div">
      <NavBarUser />
      {/* <SearchBar /> */}
      <Grid
        container
        spacing={0}
        alignItems="center"
        justifyContent="center"
        className="listings-container"
        direction="row"
      >
        {listings.map((listing) => (
          <Grid
            item
            xs={12}
            md={4.5}
            className="listings-grid-item"
            key={listing.jobId}
          >
            <ButtonBase
              className="listings-grid-buttonbase"
              onClick={() => listingClickHandler(listing)}
              value="Doctorate"
            >
              <div className="listings-grid-item-div">
                <div className="listing-title">
                  <p className="listing-title-font"> {listing.title}</p>
                </div>

                <div className="listing-location">
                  <p className="listing-location-font">{listing.location} </p>
                </div>

                <div className="listing-briefdescription">
                  <p className="listing-briefdescription-font">
                    {listing.briefDescription}
                  </p>
                </div>
              </div>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Listings;
