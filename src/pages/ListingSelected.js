import React, { useState, useEffect } from "react";
import { NavBarUser } from "../components/NavBarUser";
import { useSelector } from "react-redux";
import { Grid, TextField, Button } from "@mui/material";
import "./ListingSelected.css";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { db, storage } from "../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import JobSelected from "../components/JobSelected";
import swal from "sweetalert";
import Loading from "../components/Loading";
import LoadingBackdrop from "../components/LoadingBackdrop/LoadingBackdrop";
import { Link } from "react-router-dom";

function ListingSelected() {
  const { listings } = useSelector((state) => state.listings);
  const listingSelected = useSelector(
    (state) => state.listings.listingSelected
  );
  // const { jobId } = listingSelected;

  const jobId = listingSelected ? listingSelected.jobId : console.log("error");

  console.log(jobId);
  const { email } = useSelector((state) => state.user);
  const { uid } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [jobApplicantData, setJobApplicantData] = useState({});
  const [jobApplicationError, setJobApplicationError] = useState({});
  const [resumeFile, setresumeFile] = useState("");
  const todaysDate = new Date();
  const [isLoading, setIsLoading] = useState(false);
  // const [alreadyAppliedJobData, setAlreadyAppliedJobData] = useState({});
  const [isJobAlreadyApplied, setIsJobAlreadyApplied] = useState(null);
  // console.log(todaysDate);

  useEffect(() => {
    fetchJobsApplied();

    if (!listingSelected) {
      navigate("/listings");
    }
  }, []);

  const fetchJobsApplied = async () => {
    setIsLoading(true);
    // get firebase document
    const jobPortalRef = collection(db, "jobPortal");
    const q = query(
      jobPortalRef,
      where("email", "==", email),
      where("jobId", "==", jobId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setJobApplicantData(doc.data());
      if (Object.keys(doc.data()).length != 0) {
        setIsJobAlreadyApplied(true);
      } else {
        setIsJobAlreadyApplied(false);
      }
    });

    setIsLoading(false);
  };
  // console.log(alreadyAppliedJobData);
  console.log(isLoading);

  const applyButtonHandler = () => {
    if (email.length == 0) {
      swal(
        "Not logged in",
        "Login is required. Please login and apply",
        "error"
      ).then(navigate("/"));
    } else {
      setShowApplicationForm(true);
    }
  };

  const resumeUploadHandler = (event) => {
    setresumeFile(event.target.files[0]);
  };

  // console.log(resumeFile);
  const submitButtonHandler = () => {
    if (!jobApplicantData.fullName) {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["fullNameIsBlank"]: true,
      }));
    } else {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["fullNameIsBlank"]: false,
      }));
    }

    if (!jobApplicantData.age) {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["ageIsBlank"]: true,
      }));
    } else {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["ageIsBlank"]: false,
      }));
    }

    if (!jobApplicantData.qualification) {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["qualificationIsBlank"]: true,
      }));
    } else {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["qualificationIsBlank"]: false,
      }));
    }

    if (!jobApplicantData.experience) {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["experienceIsBlank"]: true,
      }));
    } else {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["experienceIsBlank"]: false,
      }));
    }

    if (!resumeFile) {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["resumeIsBlank"]: true,
      }));
    } else {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["resumeIsBlank"]: false,
      }));
    }

    if (
      jobApplicantData.fullName &&
      jobApplicantData.age &&
      jobApplicantData.qualification &&
      jobApplicantData.experience &&
      resumeFile
    ) {
      setIsLoading(true);
      // write document
      const documentName = jobId + uid;
      const jobPortalRef = collection(db, "jobPortal");

      const res = setDoc(doc(jobPortalRef, documentName), {
        fullName: jobApplicantData.fullName,
        age: jobApplicantData.age,
        qualification: jobApplicantData.qualification,
        experience: jobApplicantData.experience,
        jobId: jobId,
        email: email,
        date: todaysDate,
      }).then((resp) => {
        // console.log(resp);
        const storageRef = ref(storage, resumeFile.name);
        const uploadTask = uploadBytesResumable(storageRef, resumeFile);
        uploadTask.on(
          "state_changed",
          (snaphot) => {
            const progress =
              (snaphot.bytesTransferred / snaphot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snaphot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            setIsLoading(false);
            alert(error.code);
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              updateDoc(doc(jobPortalRef, documentName), {
                url: downloadURL,
              });
              console.log("File available at", downloadURL);
            });
            swal("Success", "Job Applied Successfully", "success");
            setIsLoading(false);
            setShowApplicationForm(false);
          }
        );
      });
    }
  };

  const saveButtonHandler = () => {
    setIsLoading(true);
    // write document
    const documentName = jobId + uid;
    const jobPortalRef = collection(db, "jobPortal");

    const res = setDoc(doc(jobPortalRef, documentName), {
      fullName: jobApplicantData.fullName,
      age: jobApplicantData.age,
      qualification: jobApplicantData.qualification,
      experience: jobApplicantData.experience,
      jobId: jobId,
      email: email,
      date: todaysDate,
    }).then((resp) => {
      // console.log(resp);
      setIsLoading(false);
      setShowApplicationForm(false);
      swal("Success", "Application Updated Successfully", "success");
    });
  };

  return (
    <div className="listing-selected-div">
      <NavBarUser />
      {isLoading && <LoadingBackdrop />}
      {/* selected listing details */}
      <Grid container justifyContent="center" className="listing-container">
        <Grid item xs={8} className="listing-grid-item">
          {listingSelected && <JobSelected />}
          {isJobAlreadyApplied ? (
            <Button
              onClick={applyButtonHandler}
              variant="outlined"
              color="success"
              style={{
                textTransform: "none",
                width: "12.5rem",
                borderColor: "#2bb792",
                borderWidth: "2px",
                backgroundColor: "#2bb792",
                color: "white",
              }}
            >
              Edit
            </Button>
          ) : (
            <Button
              onClick={applyButtonHandler}
              variant="outlined"
              color="success"
              style={{
                textTransform: "none",
                width: "12.5rem",
                borderColor: "#2bb792",
                borderWidth: "2px",
                backgroundColor: "#2bb792",
                color: "white",
              }}
            >
              Apply
            </Button>
          )}
        </Grid>
      </Grid>

      {/* selected listing application form */}
      {showApplicationForm && (
        <Grid
          container
          justifyContent="center"
          className="listing-selected-container-second"
        >
          <Grid item xs={8} className="listing-grid-item">
            <TableContainer component={Paper}>
              <Table style={{ width: 450, margin: "auto" }}>
                <TableBody>
                  <TableRow>
                    <TableCell className="listing-field-names">
                      Email :
                    </TableCell>
                    <TableCell className="listing-field-names" align="right">
                      {email}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="listing-field-names">
                      Full Name* :
                    </TableCell>

                    <TableCell align="right">
                      <TextField
                        variant="standard"
                        id="margin-none"
                        onChange={(event) =>
                          setJobApplicantData((prevState) => ({
                            ...prevState,
                            ["fullName"]: event.target.value,
                          }))
                        }
                        defaultValue={jobApplicantData.fullName}
                      />
                      {jobApplicationError.fullNameIsBlank && (
                        <p className="listing-selected-error">
                          * Full Name is blank
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="listing-field-names">Age* </span>(as of
                      01.01.2023) <span className="listing-field-names">:</span>
                    </TableCell>
                    <TableCell align="right" style={{ width: 100 }}>
                      <TextField
                        inputProps={{ type: "number", maxLength: 14 }}
                        type="number"
                        onChange={(event) =>
                          setJobApplicantData((prevState) => ({
                            ...prevState,
                            ["age"]: event.target.value,
                          }))
                        }
                        defaultValue={jobApplicantData.age}
                      />
                      {jobApplicationError.ageIsBlank && (
                        <p className="listing-selected-error">* Age is blank</p>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="listing-field-names">
                      Qualification* :
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        variant="standard"
                        onChange={(event) =>
                          setJobApplicantData((prevState) => ({
                            ...prevState,
                            ["qualification"]: event.target.value,
                          }))
                        }
                        defaultValue={jobApplicantData.qualification}
                      />
                      {jobApplicationError.qualificationIsBlank && (
                        <p className="listing-selected-error">
                          * Qualification is blank
                        </p>
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <span className="listing-field-names">Experience* </span>{" "}
                      (Number of years in the relevant field){" "}
                      <span className="listing-field-names">:</span>
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        onChange={(event) =>
                          setJobApplicantData((prevState) => ({
                            ...prevState,
                            ["experience"]: event.target.value,
                          }))
                        }
                        defaultValue={jobApplicantData.experience}
                      />
                      {jobApplicationError.experienceIsBlank && (
                        <p className="listing-selected-error">
                          * Experience is blank
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="listing-selected-button-div">
                {isJobAlreadyApplied ? (
                  <div>
                    <Link
                      to={jobApplicantData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="contained"
                        color="secondary"
                        component="label"
                        className="uploaded-resume"
                        style={{
                          textTransform: "none",
                        }}
                      >
                        View Uploaded Resume
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="contained"
                    component="label"
                    className="listing-selected-button"
                    style={{
                      textTransform: "none",
                    }}
                  >
                    Resume :
                    <input type="file" onChange={resumeUploadHandler} />
                  </Button>
                )}

                {jobApplicationError.resumeIsBlank && (
                  <p className="listing-selected-error">
                    * Resume is not uploaded
                  </p>
                )}
              </div>
              {isJobAlreadyApplied ? (
                <Button
                  onClick={saveButtonHandler}
                  variant="contained"
                  color="success"
                  className="listing-selected-submit-button"
                  style={{
                    textTransform: "none",
                    width: "12.5rem",
                    borderColor: "#2bb792",
                    borderWidth: "2px",
                    backgroundColor: "#2bb792",
                    color: "white",
                  }}
                >
                  Save
                </Button>
              ) : (
                <Button
                  onClick={submitButtonHandler}
                  variant="contained"
                  color="success"
                  className="listing-selected-submit-button"
                  style={{
                    textTransform: "none",
                    width: "12.5rem",
                    borderColor: "#2bb792",
                    borderWidth: "2px",
                    backgroundColor: "#2bb792",
                    color: "white",
                  }}
                >
                  Submit
                </Button>
              )}
            </TableContainer>
            {/* {isLoading && <Loading />} */}
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default ListingSelected;
