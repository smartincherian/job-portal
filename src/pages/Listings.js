import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import "./Listings.css";
import { NavBarUser } from "../components/NavBarUser";
import { useDispatch, useSelector } from "react-redux";
import { jobListingSelected, jobListings } from "../features/jobListingsSlice";
import axios from "axios";
import { Box, ButtonBase, Card, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Chip from "@mui/material/Chip";
import { db, storage } from "../firebase/config";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import LoadingBackdrop from "../components/LoadingBackdrop/LoadingBackdrop";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Listings() {
  const { email } = useSelector((state) => state.user);
  const { uid } = useSelector((state) => state.user);
  const { listings } = useSelector((state) => state.listings);
  // const [listingsNew, setListings] = useState(
  //   useSelector((state) => state.listings.listings)
  // );
  // console.log(listingsNew);

  const { searchResult } = useSelector((state) => state.search);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [jobApplicantData, setJobApplicantData] = useState([]);
  const [favoritesArray, setFavoritesArray] = useState([]);
  const [listingsWithSearch, setListingsWithSearch] = useState([]);

  //firebase
  const jobPortalRef = collection(db, "jobPortal");
  const jobPortalFavoritesRef = collection(db, "jobPortalFavorites");

  useEffect(() => {
    fetchJobListings();
  }, []);

  useEffect(() => {
    if (email.length > 0) {
      fetchJobsApplied();
      fetchFavorites();
    }
  }, [email]);

  useEffect(() => {
    if (searchResult.length > 0) {
      setListingsWithSearch(searchResult);
    } else {
      setListingsWithSearch(listings);
    }
  }, [searchResult]);

  console.log(listingsWithSearch);

  const fetchJobsApplied = async () => {
    setIsLoading(true);
    // get firebase document
    const q = query(jobPortalRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    let jobApplicationDataArray = [];
    querySnapshot.forEach((doc) => {
      jobApplicationDataArray.push(doc.data().jobId);
    });
    setJobApplicantData(jobApplicationDataArray);
    setIsLoading(false);
  };

  const fetchFavorites = async () => {
    setIsLoading(true);
    // get firebase document
    //first check whether user is having favorites list
    const jobPortalExistingFavoritesRef = doc(db, "jobPortalFavorites", email);
    const docSnapshot = await getDoc(jobPortalExistingFavoritesRef);
    console.log(docSnapshot.data().favorite.constructor === Array);
    console.log(docSnapshot.data().favorite.length);
    if (docSnapshot.data().favorite.constructor === Array) {
      console.log("It reached here");
      setFavoritesArray(docSnapshot.data().favorite);
    }
    setIsLoading(false);
  };

  const fetchJobListings = async () => {
    axios.get("./joblistings.json").then((res) => {
      dispatch(jobListings(res.data));
      setListingsWithSearch(res.data);
    });
  };

  const listingClickHandler = (listing) => {
    dispatch(jobListingSelected(listing));
    navigate(`${listing.jobId}`);
  };

  const favoriteButtonHandler = async (e) => {
    const favoriteNewJobId = e.currentTarget.value;
    console.log(favoritesArray);
    const documentName = email;
    //if user  is already having  favorites list add to the same
    let newFavoritesArray = [];
    if (favoritesArray.length > 0) {
      //if condition here whether it is already favorite or not
      if (favoritesArray.includes(favoriteNewJobId)) {
        newFavoritesArray = favoritesArray.filter(
          (item) => item != favoriteNewJobId
        );
        setFavoritesArray((oldArray) =>
          oldArray.filter((item) => item != favoriteNewJobId)
        );
        setDoc(doc(jobPortalFavoritesRef, documentName), {
          favorite: newFavoritesArray,
        }).then((resp) => {
          console.log(resp);
        });
      }
      //if it is not favorite run below
      else {
        newFavoritesArray = favoritesArray;
        newFavoritesArray.push(favoriteNewJobId);
        setFavoritesArray((oldArray) => [...oldArray, favoriteNewJobId]);
        setDoc(doc(jobPortalFavoritesRef, documentName), {
          favorite: [...new Set(newFavoritesArray)],
        }).then((resp) => {
          console.log(resp);
        });
      }
    }

    //if user  is not having favorites list run below
    else {
      console.log(favoriteNewJobId);
      setFavoritesArray([favoriteNewJobId]);
      setDoc(doc(jobPortalFavoritesRef, documentName), {
        favorite: [favoriteNewJobId],
      }).then((resp) => {
        console.log(resp);
      });
    }
  };

  return (
    <div className="listings-div">
      <NavBarUser />
      {isLoading && <LoadingBackdrop />}
      <Grid
        container
        className="listings-search-container"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={11} md={4}>
          <SearchBar />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        alignItems="stretch"
        justifyContent="center"
        className="listings-container"
        direction="row"
        style={{ height: "100%" }}
      >
        {listingsWithSearch.map((listing) => (
          <Grid
            item
            component={Card}
            xs={12}
            md={4.5}
            className="listings-grid-item"
            key={listing.jobId}
          >
            <Box className="listings-items-box">
              <ButtonBase
                className="listings-grid-buttonbase"
                onClick={() => listingClickHandler(listing)}
                value="Doctorate"
              >
                <div className="listings-grid-item-div">
                  <div item xs={11} className="listing-title">
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
              <Box>
                {jobApplicantData.includes(listing.jobId) && (
                  <Chip
                    className="listing-chip-applied"
                    label="APPLIED"
                    color="success"
                    size="small"
                    sx={{
                      fontSize: "0.8125rem",
                      backgroundColor: "#78cfcf",
                      fontFamily: "Segoe UI",
                      fontWeight: 700,
                      color: "#14332c",
                      marginTop: "0.75rem",
                    }}
                  />
                )}
                <Box item xs={1} className="listing-favorite">
                  {favoritesArray.includes(listing.jobId) ? (
                    <IconButton
                      // sx={{ "& :hover": { color: "gold" } }}
                      sx={{ color: "#F45050" }}
                      onClick={favoriteButtonHandler}
                      value={listing.jobId}
                    >
                      <FavoriteIcon className="listing-favorite-icon" />
                    </IconButton>
                  ) : (
                    <IconButton
                      // sx={{ "& :hover": { color: "gold" } }}
                      onClick={favoriteButtonHandler}
                      value={listing.jobId}
                    >
                      <FavoriteBorderIcon className="listing-favorite-icon" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Listings;
