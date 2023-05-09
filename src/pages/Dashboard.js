import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { NavBarUser } from "../components/NavBarUser";
import { useDispatch, useSelector } from "react-redux";
import { Grid, TextField, Button } from "@mui/material";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { jobListingApplied } from "../features/jobListingsSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import SavedSearchSharpIcon from "@mui/icons-material/SavedSearchSharp";
import { jobListingSelected, jobListings } from "../features/jobListingsSlice";
import JobSelected from "./JobSelected";

function Dashboard() {
  const { email } = useSelector((state) => state.user);
  const { listings } = useSelector((state) => state.listings);
  //   console.log(listings);
  const [jobsApplied, setJobsApplied] = useState([]);
  const dispatch = useDispatch();
  const [showJobSelected, setShowJobSelected] = useState(false);

  useEffect(() => {
    fetchJobsApplied();
  }, []);

  const fetchJobsApplied = async () => {
    // get firebase document
    const jobPortalRef = collection(db, "jobPortal");
    const q = query(jobPortalRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    // console.log(querySnapshot);
    let jobsArray = [];
    querySnapshot.forEach((doc) => {
      //   console.log(doc.data());
      //   console.log(doc.data().fullName);
      jobsArray.push(doc.data().jobId);
    });
    // dispatch(jobListingApplied(jobsArray));
    let filteredListings = [];
    jobsArray.map((appliedJobid) => {
      listings.map((listing) => {
        if (appliedJobid == listing.jobId) {
          filteredListings.push(listing);
        }
      });
    });
    setJobsApplied(filteredListings);
  };
  console.log(jobsApplied);
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
      // getActions: (params) => [
      //   <Button size="small" onClick={() => console.log(params.row._id)}>
      //
      //   </Button>,
      // ],
      renderCell: (row) => {
        // dispatch(jobListingSelected(row));
        return (
          <Button size="small" onClick={() => viewMoreClickHandler(row)}>
            <SavedSearchSharpIcon />
          </Button>
        );
      },
    },
  ];

  const viewMoreClickHandler = (row) => {
    console.log(row.row);
    dispatch(jobListingSelected(row.row));
    setShowJobSelected(true);
  };

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
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {showJobSelected && (
        <Grid
          container
          justifyContent="center"
          className="dashboard-container-2"
        >
          <Grid item xs={8} className="listing-grid-item">
            <p className="dashboard-close-button" onClick={closeButtonHandler}>
              X
            </p>
            <JobSelected />
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default Dashboard;
