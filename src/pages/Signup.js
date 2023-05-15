import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import { Grid, TextField, Button } from "@mui/material";
import "./Signup.css";
import background from "../assets/images/signup-bg.jpg";
import logo from "../assets/images/logo.png";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import swal from "sweetalert";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const regex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [signupFormError, setSignupFormError] = useState({});

  const signupButtonHandler = () => {
    if (email.trim().length == 0) {
      setSignupFormError((prevState) => ({
        ...prevState,
        ["emailIsBlank"]: true,
        ["emailIsInvalid"]: false,
      }));
    } else if (!regex.test(email)) {
      setSignupFormError((prevState) => ({
        ...prevState,
        ["emailIsBlank"]: false,
        ["emailIsInvalid"]: true,
      }));
    } else {
      setSignupFormError((prevState) => ({
        ...prevState,
        ["emailIsBlank"]: false,
        ["emailIsInvalid"]: false,
      }));
    }

    if (password.trim().length == 0) {
      setSignupFormError((prevState) => ({
        ...prevState,
        ["passwordIsBlank"]: true,
      }));
    } else {
      setSignupFormError((prevState) => ({
        ...prevState,
        ["passwordIsBlank"]: false,
      }));
    }

    if (password != confirmPassword) {
      setSignupFormError((prevState) => ({
        ...prevState,
        ["passwordsNotSame"]: true,
      }));
    } else {
      setSignupFormError((prevState) => ({
        ...prevState,
        ["passwordsNotSame"]: false,
      }));
    }

    if (
      email.trim().length != 0 &&
      regex.test(email) &&
      password.trim().length != 0 &&
      password == confirmPassword
    ) {
      setIsLoading(true);
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          setIsLoading(false);
          navigate("/listings");
        })
        .catch((error) => {
          setIsLoading(false);
          swal(error.code, error.message, "error");
        });
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url(" + background + ")",
        width: "100vw",
        height: "100vh",
      }}
    >
      <NavBar />
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={3}>
          <Grid
            direction="column"
            container
            spacing={2}
            className="signup-container"
          >
            <Grid>
              <div>
                <img src={logo} width="175" height="175"></img>
              </div>
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSignupFormError((prevState) => ({
                    ...prevState,
                    ["emailIsBlank"]: false,
                  }));
                }}
                size="small"
                InputLabelProps={{ style: { fontSize: 13 } }}
              />
              {signupFormError.emailIsBlank && (
                <p className="login-error">* Email is blank</p>
              )}
              {signupFormError.emailIsInvalid && (
                <p className="login-error">* Email is invalid</p>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setSignupFormError((prevState) => ({
                    ...prevState,
                    ["passwordIsBlank"]: false,
                  }));
                }}
                size="small"
                InputLabelProps={{ style: { fontSize: 13 } }}
              />
              {signupFormError.passwordIsBlank && (
                <p className="login-error">* Password is blank</p>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                variant="outlined"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                size="small"
                InputLabelProps={{ style: { fontSize: 13 } }}
              />
              {signupFormError.passwordsNotSame && (
                <p className="login-error">* Passwords do not match</p>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={signupButtonHandler}
              >
                Signup
              </Button>
            </Grid>
          </Grid>
          {isLoading && <Loading />}
        </Grid>
      </Grid>
    </div>
  );
}

export default Signup;
