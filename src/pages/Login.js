import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signin } from "../features/loggedInUserSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const regex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  const navigate = useNavigate();

  const loginButtonHandler = () => {
    if (email.trim().length == 0) {
      alert("Enter email");
    } else if (!regex.test(email)) {
      alert("Entered email is not valid");
    } else if (password.trim().length == 0) {
      alert("Enter password");
    } else {
      // const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          //Signed in
          const user = userCredential.user;
          navigate("/listings");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
        });
    }
  };

  return (
    <>
      {/* second container - right part  */}
      <Grid item xs={4}>
        <div>
          <Grid
            container
            direction="column"
            spacing={2}
            className="homepage-login-box"
          >
            <Grid item>
              <Typography className="jobseeker-login-font">
                Jobseeker login
              </Typography>
              <TextField
                onChange={(event) => setEmail(event.target.value)}
                label="Email"
                variant="outlined"
                size="small"
                // className={classes.textField}
                // value={username}
                // onChange={handleUsernameChange}
                InputLabelProps={{ style: { fontSize: 13 } }}
                style={{
                  width: "12.5rem",
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Password"
                onChange={(event) => setPassword(event.target.value)}
                variant="outlined"
                // className={classes.textField}
                type="password"
                size="small"
                InputLabelProps={{ style: { fontSize: 13 } }}
                // value={password}
                // onChange={handlePasswordChange}
                style={{
                  width: "12.5rem",
                }}
              />
            </Grid>
            <Grid item>
              <Button
                onClick={loginButtonHandler}
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
                Login →
              </Button>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </>
  );
}

export default Login;
