import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import "./NavBarUser.css";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { reset, signin } from "../features/loggedInUserSlice";
import logo from "../assets/images/logo.png";

export function NavBarUser(props) {
  const dispatch = useDispatch();
  const auth = getAuth();
  const [viewUserDetails, setviewUserDetails] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const { email, uid } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleMenu = () => {
    setviewUserDetails(!viewUserDetails);
  };

  const hideUserDetails = () => {
    setviewUserDetails(false);
  };

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const dasbhboardHandler = () => {
    navigate("/dashboard");
  };

  const homeHandler = () => {
    navigate("/");
  };

  const getLoggedInUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        const email = user.email;
        const uid = user.uid;
        dispatch(signin({ email, uid }));
        setUserLoggedIn(true);
      } else {
        dispatch(reset());
        setUserLoggedIn(false);
        console.log("No user logged in");
      }
    });
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  return (
    <div className="navbaruser-div">
      <span className="helpMe">All Glory to God</span>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ background: "#4D5139" }}>
          <Toolbar variant="dense">
            <div>
              <img src={logo} width="60" height="40"></img>
            </div>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ flexGrow: 1 }}
              className="navbaruser-sentence"
            >
              Welcome to 7th Pillar Jobs : Connecting talent with opportunity.
            </Typography>
            {userLoggedIn && (
              <div>
                <IconButton
                  aria-label="loggedInUser"
                  size="large"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                >
                  <AccountCircle />
                </IconButton>
                {viewUserDetails && (
                  <Menu
                    sx={{ mt: "5vh" }}
                    id="menu-appbar"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(viewUserDetails)}
                    onClick={hideUserDetails}
                  >
                    {console.log(email)}

                    <div className="user-details">
                      <p>EmailId: {email}</p>
                      <div className="navbar-dashboard">
                        <p
                          className="dashboard-button"
                          onClick={dasbhboardHandler}
                        >
                          Dashboard
                        </p>

                        <p className="dashboard-button" onClick={homeHandler}>
                          Home
                        </p>
                      </div>
                      <div className="logout">
                        {/* <Logout /> */}
                        <p className="logout-button" onClick={logoutHandler}>
                          Logout{" "}
                        </p>
                      </div>
                    </div>
                  </Menu>
                )}
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
