import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  Grid,
  TextField,
  Button,
  FormControl,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import logo from "../../assets/images/logoNavbar.png";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import Loading from "../Loading";
import "./JobApplicationForm.css";

function JobApplicationForm(props) {
  const { isJobAlreadyApplied } = props;
  const { jobAlreadyAppliedData } = props;

  const { email } = useSelector((state) => state.user);
  const { uid } = useSelector((state) => state.user);

  const listingSelected = useSelector(
    (state) => state.listings.listingSelected
  );
  const [jobApplicationError, setJobApplicationError] = useState({});
  const [jobApplicantData, setJobApplicantData] = useState(
    jobAlreadyAppliedData ? jobAlreadyAppliedData : {}
  );
  const [resumeFile, setresumeFile] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const todaysDate = new Date();
  const jobId = listingSelected ? listingSelected.jobId : console.log("error");

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
    } else if (jobApplicantData.age < 18) {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["ageIsInvalid"]: true,
      }));
    } else {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["ageIsBlank"]: false,
        ["ageIsInvalid"]: false,
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
    } else if (jobApplicantData.experience < 0) {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["experienceIsInvalid"]: true,
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
      jobApplicantData.age > 17 &&
      jobApplicantData.qualification &&
      jobApplicantData.experience &&
      jobApplicantData.experience > 0 &&
      resumeFile &&
      !jobApplicationError.resumeFileInvalid &&
      !jobApplicationError.resumeFileOverSize
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
            setIsLoading(false);

            swal("Success", "Job Applied Successfully", "success").then(() =>
              navigate("/dashboard")
            );
          }
        );
      });
    }
  };

  const saveButtonHandler = () => {
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
    } else if (jobApplicantData.age < 18) {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["ageIsInvalid"]: true,
      }));
    } else {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["ageIsBlank"]: false,
        ["ageIsInvalid"]: false,
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

    if (
      jobApplicantData.fullName &&
      jobApplicantData.age &&
      jobApplicantData.age > 17 &&
      jobApplicantData.qualification &&
      jobApplicantData.experience &&
      jobApplicantData.experience > 0
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
        setIsLoading(false);
        swal("Success", "Application Updated Successfully", "success").then(
          () => navigate("/dashboard")
        );
      });
    }
  };

  const resumeUploadHandler = (event) => {
    if (event.target.files[0].type != "application/pdf") {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["resumeFileInvalid"]: true,
      }));
      setresumeFile("");
    } else {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["resumeFileInvalid"]: false,
      }));
    }
    if (event.target.files[0].size / (1024 * 1024) > 2) {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["resumeFileOverSize"]: true,
      }));
      setresumeFile("");
    } else {
      setJobApplicationError((prevState) => ({
        ...prevState,
        ["resumeFileOverSize"]: false,
      }));
    }

    if (
      event.target.files[0].type == "application/pdf" &&
      event.target.files[0].size / (1024 * 1024) <= 2
    )
      setresumeFile(event.target.files[0]);
  };

  return (
    <>
      {/* <TableContainer>
        <h3 className="listing-grid-item-heading">Job Application</h3>
        <Table sx={{ width: { md: 450 }, margin: "auto" }}>
          <TableBody>
            <TableRow>
              <TableCell className="listing-field-names">Email :</TableCell>
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
                  onChange={(event) => {
                    setJobApplicantData((prevState) => ({
                      ...prevState,
                      ["fullName"]: event.target.value,
                    }));
                    setJobApplicationError((prevState) => ({
                      ...prevState,
                      ["fullNameIsBlank"]: false,
                    }));
                  }}
                  defaultValue={jobApplicantData.fullName}
                />
                {jobApplicationError.fullNameIsBlank && (
                  <p className="listing-selected-error">* Full Name is blank</p>
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
                  InputProps={{
                    inputProps: { min: 18 },
                  }}
                  onChange={(event) => {
                    setJobApplicantData((prevState) => ({
                      ...prevState,
                      ["age"]: event.target.value,
                    }));
                    setJobApplicationError((prevState) => ({
                      ...prevState,
                      ["ageIsBlank"]: false,
                    }));
                  }}
                  defaultValue={jobApplicantData.age}
                />
                {jobApplicationError.ageIsBlank && (
                  <p className="listing-selected-error">* Age is blank</p>
                )}
                {jobApplicationError.ageIsInvalid && (
                  <p className="listing-selected-error">* Minimum Age is 18</p>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="listing-field-names">
                Qualification*:
              </TableCell>
              <TableCell align="right">
                <TextField
                  variant="standard"
                  onChange={(event) => {
                    setJobApplicantData((prevState) => ({
                      ...prevState,
                      ["qualification"]: event.target.value,
                    }));
                    setJobApplicationError((prevState) => ({
                      ...prevState,
                      ["qualificationIsBlank"]: false,
                    }));
                  }}
                  defaultValue={jobApplicantData.qualification}
                />
                {console.log(jobApplicantData.qualification)}
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
                (Number of years in the relevant field)
                <span className="listing-field-names">:</span>
              </TableCell>
              <TableCell align="right">
                <TextField
                  value={jobApplicantData.experience}
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                  onChange={(event) => {
                    setJobApplicationError((prevState) => ({
                      ...prevState,
                      ["experienceIsBlank"]: false,
                    }));
                    setJobApplicantData((prevState) => ({
                      ...prevState,
                      ["experience"]: event.target.value,
                    }));
                  }}
                  defaultValue={jobApplicantData.experience}
                />
                {jobApplicationError.experienceIsBlank && (
                  <p className="listing-selected-error">
                    * Experience is blank
                  </p>
                )}
                {jobApplicationError.experienceIsInvalid && (
                  <p className="listing-selected-error">
                    * Enter valid experience
                  </p>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="listing-selected-resume-div">
          {isJobAlreadyApplied ? (
            <div className="listing-selected-resume-div">
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
                    fontFamily: "Segoe UI",
                    fontWeight: 600,
                  }}
                >
                  View Uploaded Resume
                </Button>
              </Link>
            </div>
          ) : (
            <div listing-selected-resume-div>
              <Button
                variant="contained"
                component="label"
                className="listing-selected-button"
                style={{
                  textTransform: "none",
                  fontFamily: "Segoe UI",
                  fontWeight: 600,
                }}
              >
                Resume :
                <input type="file" onChange={resumeUploadHandler} />
              </Button>
            </div>
          )}

          {jobApplicationError.resumeIsBlank && (
            <p className="listing-selected-error">* Resume is not uploaded</p>
          )}

          {jobApplicationError.resumeFileInvalid && (
            <p className="listing-selected-error">
              * Only .pdf files are supported
            </p>
          )}

          {jobApplicationError.resumeFileOverSize && (
            <p className="listing-selected-error">
              * Only files up to 2MB are supported
            </p>
          )}
        </div>

        {isJobAlreadyApplied ? (
          <div className="listing-selected-button-div">
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
                fontFamily: "Segoe UI",
                fontWeight: 600,
              }}
            >
              {isLoading ? <Loading /> : "Save"}
            </Button>
          </div>
        ) : (
          <div className="listing-selected-button-div">
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
                fontFamily: "Segoe UI",
                fontWeight: 600,
              }}
            >
              {isLoading ? <Loading /> : "Submit"}
            </Button>
          </div>
        )}
      </TableContainer> */}

      <Grid container>
        <Grid item xs={12}>
          <div className="job-application-form-logo">
            <img src={logo} width="45" height="35" className="logo"></img>
          </div>
          <h3 className="job-application-form-heading">Job Application</h3>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="caption"
            sx={{
              color: "#595959",
              fontWeight: "bold",
            }}
          >
            Email: {email}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            InputLabelProps={{ style: { fontSize: 14 } }}
            inputProps={{ style: { fontSize: 14 } }}
            variant="outlined"
            label="Full Name*"
            onChange={(event) => {
              setJobApplicantData((prevState) => ({
                ...prevState,
                ["fullName"]: event.target.value,
              }));
              setJobApplicationError((prevState) => ({
                ...prevState,
                ["fullNameIsBlank"]: false,
              }));
            }}
            defaultValue={jobApplicantData.fullName}
            sx={{ marginTop: 3 }}
            size="small"
            error={jobApplicationError.fullNameIsBlank}
            helperText={
              jobApplicationError.fullNameIsBlank && "Full Name is blank"
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            variant="outlined"
            inputProps={{ style: { fontSize: 14 } }}
            InputLabelProps={{ style: { fontSize: 14 } }}
            sx={{
              marginTop: 3,
              "& .css-k4qjio-MuiFormHelperText-root": {
                marginTop: "0",
                fontSize: 10,
              },
            }}
            label="Age*"
            size="small"
            inputProps={{ type: "number", maxLength: 14 }}
            type="number"
            InputProps={{
              inputProps: { min: 18 },
            }}
            onChange={(event) => {
              setJobApplicantData((prevState) => ({
                ...prevState,
                ["age"]: event.target.value,
              }));
              setJobApplicationError((prevState) => ({
                ...prevState,
                ["ageIsBlank"]: false,
              }));
            }}
            defaultValue={jobApplicantData.age}
            error={
              jobApplicationError.ageIsBlank || jobApplicationError.ageIsInvalid
            }
            helperText={
              jobApplicationError.ageIsBlank
                ? "Age is blank"
                : jobApplicationError.ageIsInvalid
                ? "Minimum Age is 18"
                : "As of 01-01-2023"
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            InputLabelProps={{ style: { fontSize: 14 } }}
            inputProps={{ style: { fontSize: 14 } }}
            variant="outlined"
            label="Qualification*"
            sx={{ marginTop: 3 }}
            size="small"
            onChange={(event) => {
              setJobApplicantData((prevState) => ({
                ...prevState,
                ["qualification"]: event.target.value,
              }));
              setJobApplicationError((prevState) => ({
                ...prevState,
                ["qualificationIsBlank"]: false,
              }));
            }}
            defaultValue={jobApplicantData.qualification}
            error={jobApplicationError.qualificationIsBlank}
            helperText={
              jobApplicationError.qualificationIsBlank &&
              "Qualification is blank"
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            InputLabelProps={{ style: { fontSize: 14 } }}
            inputProps={{ style: { fontSize: 14 } }}
            variant="outlined"
            label="Experience*"
            sx={{
              marginTop: 3,
              "& .css-k4qjio-MuiFormHelperText-root": {
                marginTop: "0",
                fontSize: 10,
              },
            }}
            size="small"
            value={jobApplicantData.experience}
            type="number"
            InputProps={{
              inputProps: { min: 0 },
            }}
            onChange={(event) => {
              setJobApplicationError((prevState) => ({
                ...prevState,
                ["experienceIsBlank"]: false,
              }));
              setJobApplicantData((prevState) => ({
                ...prevState,
                ["experience"]: event.target.value,
              }));
            }}
            defaultValue={jobApplicantData.experience}
            error={
              jobApplicationError.experienceIsBlank ||
              jobApplicationError.experienceIsInvalid
            }
            helperText={
              jobApplicationError.experienceIsBlank
                ? "Experience is blank"
                : jobApplicationError.experienceIsInvalid
                ? "Enter valid experience"
                : "In years"
            }
          />
        </Grid>

        <Grid item xs={12}>
          {isJobAlreadyApplied ? (
            <div className="job-application-form-resume-div">
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
                    fontFamily: "Segoe UI",
                    fontWeight: 600,
                  }}
                >
                  View Uploaded Resume
                </Button>
              </Link>
            </div>
          ) : (
            <div listing-selected-resume-div>
              <Button
                variant="contained"
                component="label"
                className="listing-selected-button"
                style={{
                  textTransform: "none",
                  fontFamily: "Segoe UI",
                  fontWeight: 600,
                }}
              >
                Resume :
                <input type="file" onChange={resumeUploadHandler} />
              </Button>
            </div>
          )}

          {jobApplicationError.resumeIsBlank && (
            <p className="listing-selected-error">* Resume is not uploaded</p>
          )}

          {jobApplicationError.resumeFileInvalid && (
            <p className="listing-selected-error">
              * Only .pdf files are supported
            </p>
          )}

          {jobApplicationError.resumeFileOverSize && (
            <p className="listing-selected-error">
              * Only files up to 2MB are supported
            </p>
          )}

          {isJobAlreadyApplied ? (
            <div className="job-application-form-button-div">
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
                  fontFamily: "Segoe UI",
                  fontWeight: 600,
                }}
              >
                {isLoading ? <Loading /> : "Save"}
              </Button>
            </div>
          ) : (
            <div className="listing-selected-button-div">
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
                  fontFamily: "Segoe UI",
                  fontWeight: 600,
                }}
              >
                {isLoading ? <Loading /> : "Submit"}
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default JobApplicationForm;
