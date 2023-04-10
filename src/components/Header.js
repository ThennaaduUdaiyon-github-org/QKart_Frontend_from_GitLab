import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  //useEffect(() => {console.log("12345", typeof(hasHiddenAuthButtons));}, [])

  const [clickedLogout, setClickedLogout] = useState(false);

  useEffect(() => {
    //console.log("Printing children...", children);
    console.log("useEffect has been invoked!! 12345");
  }, [clickedLogout]);

  const history = useHistory();

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {/*When coming from Products page, hasHiddenAuthButtons is undefined!!!*/}
      {hasHiddenAuthButtons && (
        <Button
          name="back to explore"
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          //UNDERSTAND HOW WE USE UseHistory!!!!
          onClick={() => {
            history.push("/", { from: "Either Login page or Register page" });
          }}
        >
          Back to explore
        </Button>
      )}

      {/* When coming from login page but not logged in... 
      Also check out https://stackoverflow.com/questions/16010827/html5-localstorage-checking-if-a-key-exists
      */}

      {!hasHiddenAuthButtons && !localStorage.getItem("username") && (
        <Box component="div">
          <Button
            name="login"
            variant="text"
            color="primary"
            onClick={() => {
              history.push("/login", { from: "Products page" });
            }}
          >
            Login
          </Button>
          <Button
            name="register"
            variant="contained"
            color="primary"
            onClick={() => {
              history.push("/register", { from: "Products page" });
            }}
          >
            Register
          </Button>
        </Box>
      )}
      {/* When coming from login page and logged in... */}
      {!hasHiddenAuthButtons && localStorage.getItem("username") && (
        <Box
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* <Avatar src="avatar.png" />
          {localStorage.getItem("username").username} */}
          <img src={"avatar.png"} alt={localStorage.getItem("username")} />
          {/* When below text is added, individual elements aren't accessible in inspect mode!! */}
          {localStorage.getItem("username")}

          <Button
            name="logout"
            variant="text"
            color="primary"
            onClick={() => {
              history.push("/", { from: "Logged in products page" });
              localStorage.clear();
              setClickedLogout(true);
            }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Header;
