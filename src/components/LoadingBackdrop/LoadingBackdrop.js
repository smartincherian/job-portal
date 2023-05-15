import React from "react";
import Backdrop from "./Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./LoadingBackdrop.css";

function LoadingBackdrop() {
  return (
    <div>
      <Backdrop />
      <div className="spinner-loading">
        <CircularProgress>Loading.....</CircularProgress>
      </div>
    </div>
  );
}

export default LoadingBackdrop;
