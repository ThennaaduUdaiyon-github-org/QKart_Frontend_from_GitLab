import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link, Switch, Route } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";
import Register from "./Register";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({ username: "", password: "" });

  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    setIsLoading(true);

    const jsonFormData = {
      username: formData.username,
      password: formData.password,
    };

    // Returns false if criteria is not met
    if (!validateInput(jsonFormData)) {
      //
      return null;
    }

    axios
      .post(config.endpoint + "/auth/login", jsonFormData)
      .then((resp) => {
        setIsLoading(true);
        enqueueSnackbar("Logged in successfully", { variant: "success" });
        persistLogin(resp.data.token, resp.data.username, resp.data.balance);
        history.push("/", { from: "Login page" });
        console.log("Response for login is:", resp);
      })
      .catch((err) => {
        setIsLoading(true);
        if (typeof err.response !== "undefined") {
          if (err.response.status === 400) {
            enqueueSnackbar(err.response.data.message, { variant: "error" });
          }
        } else {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
            { variant: "error" }
          );
        }
      });
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    if (data.username === "") {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    if (data.password === "") {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    // Originally, stored all data as "userInfo"
    /*
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ username: username, token: token, balance: balance })
    );
    */
   localStorage.setItem("username", username);
   localStorage.setItem("token", token);
   localStorage.setItem("balance", balance);
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={false} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            label="username"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <TextField
            label="password"
            variant="outlined"
            type="password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {!isLoading && (
            <Button
              onClick={() => {
                login(formData);
              }}
              variant="contained"
            >
              LOGIN TO QKART
            </Button>
          )}
          {isLoading && (
            <Box display="flex" flexDirection="row" justifyContent="center">
              <CircularProgress />
            </Box>
          )}
          <br />
          Don’t have an account? <Link to="/register"> Register now </Link>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
