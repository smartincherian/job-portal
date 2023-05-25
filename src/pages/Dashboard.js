import React, { useEffect, useState, useRef } from "react";
import "./Dashboard.css";
import { NavBarUser } from "../components/NavBarUser";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Button, IconButton } from "@mui/material";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { DataGrid } from "@mui/x-data-grid";
import { jobListingSelected, jobListings } from "../features/jobListingsSlice";
import JobSelected from "../components/ListingSelected/JobSelected";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import RemoveRedEyeSharpIcon from "@mui/icons-material/RemoveRedEyeSharp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WorkIcon from "@mui/icons-material/Work";
import { useNavigate } from "react-router-dom";
import ListingSelected from "./ListingSelected";

function Dashboard() {
  const { email } = useSelector((state) => state.user);
  const { listings } = useSelector((state) => state.listings);
  const [jobsApplied, setJobsApplied] = useState([]);
  const [jobsFavorite, setJobsFavorite] = useState([]);
  const [jobsApplicationData, setJobsApplicationData] = useState([]);
  const dispatch = useDispatch();
  const [showJobSelected, setShowJobSelected] = useState(false);
  const [showListingSelected, setShowListingSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJobAppliedDate, setSelectedJobAppliedDate] = useState();
  const [showFavorites, setShowFavorites] = useState(false);
  const [showJobsApplied, setShowJobsApplied] = useState(true);
  const [favoritesArray, setFavoritesArray] = useState([]);
  const [favoriteSelectedJobId, setFavoriteSelectedJobId] = useState("");
  const navigate = useNavigate();
  const ref = useRef(null);
  const topRef = useRef(null);
  // const windowSize = useRef([window.innerWidth]);

  // console.log(windowSize.current[0]);

  const fetchJobListings = async () => {
    axios.get("./joblistings.json").then((res) => {
      dispatch(jobListings(res.data));
    });
  };

  useEffect(() => {
    fetchJobsApplied();
    //to prevent data lost after refresh
    fetchJobListings();
  }, [email]);

  const isMobileView = window.innerWidth < 600;
  // console.log(showJobSelected);

  const fetchJobsApplied = async () => {
    setIsLoading(true);
    // get firebase document
    const jobPortalRef = collection(db, "jobPortal");
    // console.log(email);
    const q = query(jobPortalRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    let jobsApplicationData = [];
    querySnapshot.forEach((doc) => {
      jobsApplicationData.push({
        jobId: doc.data().jobId,
        date: doc.data().date,
      });
    });
    // console.log(jobsApplicationData);

    let filteredListings = [];
    setJobsApplicationData(jobsApplicationData);
    jobsApplicationData.map((item) => {
      // console.log(item);
      listings.map((listing) => {
        if (item.jobId == listing.jobId) {
          filteredListings.push(listing);
        }
      });
    });
    setJobsApplied(filteredListings);
    setIsLoading(false);
  };
  // console.log(jobsApplied);
  // console.log(window.innerWidth < 600);
  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      hide: true,
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 1,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
    },
    {
      field: "view",
      headerName: "View Details",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (row) => {
        return (
          <Button
            size="small"
            onClick={() => viewMoreClickHandler(row)}
            sx={{ padding: 0 }}
          >
            <RemoveRedEyeSharpIcon />
            {/* <SavedSearchSharpIcon sx={{ padding: 0 }} /> */}
          </Button>
        );
      },
    },
  ];

  const viewMoreClickHandler = (row) => {
    dispatch(jobListingSelected(row.row));
    if (showJobsApplied) {
      jobsApplicationData.map((job) => {
        if (row.row.jobId == job.jobId) {
          const date = job.date.toDate().toLocaleDateString();
          setSelectedJobAppliedDate(date);
        }
      });
    }

    if (showFavorites) {
      setFavoriteSelectedJobId(row.row.jobId);
    }

    // setShowJobSelected(true);
    setShowListingSelected(true);
    scrollDown();
  };
  console.log(topRef.current);
  const scrollDown = () => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // console.log(favoriteSelectedJobId);
  // console.log(selectedJobAppliedDate);

  const closeButtonHandler = () => {
    setShowListingSelected(false);
    // topRef.current?.scrollIntoView({ behavior: "smooth" });
    window.scrollTo(0, 0);
  };
  // console.log(showJobSelected);
  const handleCellClick = (param, event) => {
    event.defaultMuiPrevented = param.field === "view";
  };

  const favoriteButtonHandler = async () => {
    setShowFavorites(true);
    setShowJobsApplied(false);
    setIsLoading(true);
    const jobPortalExistingFavoritesRef = doc(db, "jobPortalFavorites", email);

    let jobsFavoriteData = [];
    const docSnapshot = await getDoc(jobPortalExistingFavoritesRef);

    try {
      if (docSnapshot.data().favorite.constructor === Array) {
        jobsFavoriteData = docSnapshot.data().favorite;

        let filteredListings = [];
        jobsFavoriteData.map((item) => {
          listings.map((listing) => {
            if (item == listing.jobId) {
              filteredListings.push(listing);
            }
          });
        });

        setJobsFavorite(filteredListings);

        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // console.log(favoritesArray);

  const jobsAppliedButtonHandler = () => {
    setShowFavorites(false);
    setShowJobsApplied(true);
  };

  const jobApplyButtonHandler = () => {
    navigate(`/listings/${favoriteSelectedJobId}`);
  };

  return (
    <div className="dashboard" ref={topRef}>
      <NavBarUser />
      <Grid
        container
        justifyContent="center"
        className="dashboard-container"
        alignItems="center"
        direction="row"
      >
        <Grid item md={11} xs={11} className="dashboard-grid-item">
          <Grid container>
            <Grid item md={9} xs={11}>
              <h3>
                <span className="dashboard-selected-field">Email: </span>
                {email}
              </h3>
            </Grid>
            <Grid item md={3} xs={11} className="dashboard-icon">
              {showJobsApplied ? (
                <IconButton
                  // sx={{ "& :hover": { color: "gold" } }}
                  sx={{ color: "#F45050" }}
                  onClick={favoriteButtonHandler}
                  className="dashboard-favorite-button"
                >
                  <FavoriteIcon className="listing-favorite-icon" />
                  <p className="dashboard-favorites-word">
                    Click for Favorites{" "}
                  </p>
                </IconButton>
              ) : (
                <IconButton
                  // sx={{ "& :hover": { color: "gold" } }}
                  sx={{ color: "#482121" }}
                  onClick={jobsAppliedButtonHandler}
                  className="dashboard-work-button"
                >
                  <WorkIcon className="listing-work-icon" />
                  <p className="dashboard-work-word">Click for Jobs Applied </p>
                </IconButton>
              )}
            </Grid>
          </Grid>

          {showJobsApplied && (
            <Grid container justifyContent="center" alignItems="center">
              <h2 className="dashboard-heading">Jobs applied</h2>
              <Grid item xs={12} className="dashboard-grid-item-2">
                <DataGrid
                  HorizontalScrollBarVisibility="Hidden"
                  rows={jobsApplied}
                  getRowId={(row) => row.jobId}
                  columns={columns}
                  disableSelectionOnClick
                  disableRowSelectionOnClick
                  hideFooterPagination
                  hideFooter
                  hideFooterSelectedRowCount
                  showCellRightBorder
                  autoHeight
                  keepNonExistentRowsSelected
                  onCellClick={handleCellClick}
                  columnVisibilityModel={{
                    // Hide columns
                    title: !isMobileView,
                    location: !isMobileView,
                  }}
                  slots={{
                    noRowsOverlay: () => (
                      <div className="dashboard-nodata-div">
                        <p className="dashboard-nodata-message">
                          Nil Job Applications so far...
                        </p>
                      </div>
                    ),
                    loadingOverlay: LinearProgress,
                  }}
                  loading={isLoading}
                />
              </Grid>
            </Grid>
          )}

          {showFavorites && (
            <Grid container justifyContent="center" alignItems="center">
              <h2 className="dashboard-heading">Favorite Jobs</h2>
              <Grid item xs={12} className="dashboard-grid-item-2">
                <DataGrid
                  HorizontalScrollBarVisibility="Hidden"
                  rows={jobsFavorite}
                  getRowId={(row) => row.jobId}
                  columns={columns}
                  disableSelectionOnClick
                  disableRowSelectionOnClick
                  hideFooterPagination
                  hideFooter
                  hideFooterSelectedRowCount
                  showCellRightBorder
                  autoHeight
                  keepNonExistentRowsSelected
                  onCellClick={handleCellClick}
                  columnVisibilityModel={{
                    // Hide columns
                    title: !isMobileView,
                    location: !isMobileView,
                  }}
                  slots={{
                    noRowsOverlay: () => (
                      <div className="dashboard-nodata-div">
                        <p className="dashboard-nodata-message">
                          Nil Job Favorites...
                        </p>
                      </div>
                    ),
                    loadingOverlay: LinearProgress,
                  }}
                  loading={isLoading}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* {showJobSelected && (
        <>
          <Grid
            container
            justifyContent="center"
            className="dashboard-container-2"
          >
            <Grid item md={8} xs={11} className="listing-grid-item">
              <p
                className="dashboard-close-button"
                onClick={closeButtonHandler}
              >
                X
              </p>
              <JobSelected />

              {showJobsApplied && (
                <h4>
                  <span className="listing-selected-field">Applied Date: </span>
                  {selectedJobAppliedDate}
                </h4>
              )}

              {showFavorites && (
                <h4
                  className="listing-click-toapply"
                  onClick={jobApplyButtonHandler}
                >
                  <span className="listing-click-toapply">
                    Click here to apply for this Job
                  </span>
                </h4>
              )}
            </Grid>
          </Grid>
        </>
      )} */}

      <div ref={ref}>
        {showListingSelected && (
          <ListingSelected hideNavbar={true} onClose={closeButtonHandler} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
