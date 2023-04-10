import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";

import theme from "./theme";
import { ThemeProvider } from "@mui/material";

import Products from "./components/Products";
import Register from "./components/Register";
import Login from "./components/Login";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

//console.log("Workspace IP is:", ipConfig.workspaceIp);

function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      <Switch>
        <Route exact path="/">
          <Products />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
