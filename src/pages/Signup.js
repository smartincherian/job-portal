import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import { Grid, TextField, Button } from "@mui/material";
import "./Signup.css";
import background from "../assets/images/signup-bg.jpg";
import logo from "../assets/images/logo.png";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const regex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

  const signupButtonHandler = () => {
    if (email.trim().length == 0) {
      alert("Enter email");
    } else if (!regex.test(email)) {
      alert("Entered email is not valid");
    } else if (password.trim().length == 0) {
      alert("Enter password");
    } else if (password != confirmPassword) {
      alert("Passwords do not match");
    } else {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          alert(`User with email ${email} successfully added`);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          alert(errorMessage);
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
                onChange={(event) => setEmail(event.target.value)}
                size="small"
                InputLabelProps={{ style: { fontSize: 13 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                size="small"
                InputLabelProps={{ style: { fontSize: 13 } }}
              />
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
        </Grid>
      </Grid>
    </div>
  );
}

export default Signup;
