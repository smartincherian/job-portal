import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { NavBarUser } from "../components/NavBarUser";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Button } from "@mui/material";
import { db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { DataGrid } from "@mui/x-data-grid";
import SavedSearchSharpIcon from "@mui/icons-material/SavedSearchSharp";
import { jobListingSelected, jobListings } from "../features/jobListingsSlice";
import JobSelected from "../components/JobSelected";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";

function Dashboard() {
  const { email } = useSelector((state) => state.user);
  const { listings } = useSelector((state) => state.listings);
  const [jobsApplied, setJobsApplied] = useState([]);
  const [jobsApplicationData, setJobsApplicationData] = useState([]);
  const dispatch = useDispatch();
  const [showJobSelected, setShowJobSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJobAppliedDate, setSelectedJobAppliedDate] = useState();

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

  const fetchJobsApplied = async () => {
    setIsLoading(true);
    // get firebase document
    const jobPortalRef = collection(db, "jobPortal");
    console.log(email);
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
  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
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
          <Button size="small" onClick={() => viewMoreClickHandler(row)}>
            <SavedSearchSharpIcon />
          </Button>
        );
      },
    },
  ];

  const viewMoreClickHandler = (row) => {
    dispatch(jobListingSelected(row.row));
    jobsApplicationData.map((job) => {
      if (row.row.jobId == job.jobId) {
        const date = job.date.toDate().toLocaleDateString();
        setSelectedJobAppliedDate(date);
      }
    });
    setShowJobSelected(true);
  };

  // console.log(selectedJobAppliedDate);

  const closeButtonHandler = () => {
    setShowJobSelected(false);
  };

  return (
    <div className="dashboard">
      <NavBarUser />

      <Grid
        container
        justifyContent="center"
        className="dashboard-container"
        alignItems="center"
        direction="row"
      >
        <Grid item xs={8} className="dashboard-grid-item">
          <h3>
            <span className="dashboard-selected-field">Email: </span>
            {email}
          </h3>
          <h4>Jobs applied:</h4>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={10} className="dashboard-grid-item-2">
              <DataGrid
                rows={jobsApplied}
                getRowId={(row) => row.jobId}
                columns={columns}
                disableRowSelectionOnClick
                hideFooterPagination
                hideFooter
                hideFooterSelectedRowCount
                showCellRightBorder
                autoHeight
                keepNonExistentRowsSelected
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
        </Grid>
      </Grid>

      {showJobSelected && (
        <>
          <Grid
            container
            justifyContent="center"
            className="dashboard-container-2"
          >
            <Grid item xs={8} className="listing-grid-item">
              <p
                className="dashboard-close-button"
                onClick={closeButtonHandler}
              >
                X
              </p>
              <JobSelected />
              {/* data from firebase */}
              <h4>
                <span className="listing-selected-field">Applied Date: </span>
                {selectedJobAppliedDate}
              </h4>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
}

export default Dashboard;
