import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import "./NavBar.css";

export function NavBar(props) {
  return (
    <div className="navbar-div">
      <span className="helpMe">All Glory to God</span>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ background: "#4D5139" }}>
          <Toolbar variant="dense">
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              7th Pillar Jobs : Connecting job seekers with their dream career
              opportunities - your one-stop-shop for all job-related needs.🎉{" "}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
