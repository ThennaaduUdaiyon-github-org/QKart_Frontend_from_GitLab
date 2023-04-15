import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy




/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * @property {string} _id - Unique ID for the product
 */

// OPTIONAL: WHEN PAGE LOADS WITH SLOW 3G, SEE AND MODIFY THE ORDER IN WHICH ELEMENTS
// ARE LOADED

const Products = () => {
  const [arrayOfPdts, setArrayOfPdts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [searchBarIsEmpty, setSearchBarIsEmpty] = useState(true);
  const [noResultsFound, setNoResultsFound] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  let prevTimerId = -1;

  useEffect(() => {
    performAPICall();
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const performAPICall = async () => {
    setIsLoading(true);
    try {
      const respObj = await axios.get(config.endpoint + "/products");
      //console.log("Array of products is: ", respObj.data);
      setIsLoading(false);
      setArrayOfPdts(respObj.data);
      //console.log(respObj.data);
      return respObj.data;
    } catch (err) {
      setIsLoading(false);

      if (typeof err.response !== "undefined") {
        const respCode = err.response.status;
        if (respCode === 400) {
          enqueueSnackbar(err.response.data.message, { variant: "error" });
        }
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }

      //console.log("OOPS! The followign error was encountered: \n", err);
      return null;
    }
  };

  // THIS METHOD WAS NOT WORKING. RAJESH -> MAKE ARRAYofPDTS A STATE VAR. SO THAT
  // WHEN IT'S updated, re-rendering happens!

  // let arr = [];
  // arr = async performAPICall();
  // console.log(arr);

  // let arr = (async () => {
  //   const x = await performAPICall();
  //   return x;
  // })();

  // console.log("Array is: ", arr);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  // CAN WE REUSE PERFORMAPICALL FOR PERFORMSEARCH FUNCTION?????
  const performSearch = async (text) => {
    if (text === "") {
      setSearchBarIsEmpty(true);
    }

    // If error is encountered in try, control leaves all other statements
    // and directly jumps to catch????
    else {
      setSearchBarIsEmpty(false);
      try {
        const respObj = await axios.get(
          config.endpoint + `/products/search?value=${text}`
        );
        if (respObj) {
          //console.log("Inside IF block!");
          setNoResultsFound(false);
        }
        //console.log("Will I get called after re-rendering???");
        //console.log(respObj);
        // Using setState and not inside onChange, works!!!!!
        setArrayOfPdts(respObj.data);
        return respObj.data;
      } catch (err) {
        setNoResultsFound(true);
        //console.log("Error inside performSearch!! ");
        // Using console.dir() prints the error object as JSON!
        //console.dir(err);
        if (typeof err.response !== "undefined") {
          const respCode = err.response.status;
          if (String(respCode).slice(0, 2) === "40") {
            enqueueSnackbar(err.response.statusText, { variant: "error" });
            // BELOW LINE DOESN'T WORK!! DIFFERENT RESPONSES HAVE DIFFERENT STRUCTURES??
            // enqueueSnackbar(err.response.data.message, { variant: "error" });
          }
          // ELSE IS NOT WORKING!!!!!
        } else {
          //console.log("Inside else!");
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
            { variant: "error" }
          );
        }
        return [];
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    //console.log("Inside debounceSearch function: ", debounceTimeout);

    // SCENARIO: BY THE TIME NEXT CALL COMES, PREVIOUS SETTIMEOUT HAD EXPIRED.
    // BUT IT'S timer ID will still be stored in 'prevTimerId'.
    // So, clearTimeout(expired_process's ID) will not throw error????????
    if (prevTimerId) {
      clearTimeout(prevTimerId);
    }
    prevTimerId = debounceTimeout;
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {};

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {};

  return (
    <div>
      <Header
        children={
          <TextField
            className="search-desktop"
            sx={{ width: "60ch" }}
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            // WILL THIS WORK??? FUNCTION IS IN PRODUCTS.JS. BUT COMPONENT IS PASSED
            // TO HEADER.JS!!

            // HOW TO LINK 2 SEARCH BARS TOGETHER????
            onChange={(e) => {
              const debounceTimeout = setTimeout(function () {
                performSearch(e.target.value);
              }, 500);
              debounceSearch(e, debounceTimeout);
            }}
            // ONLY HTML IS VISIBLE IN WEB PAGE INSPECT. HOW TO INSPECT REACT JS COMPONENTS??????
            placeholder="Search for items/categories"
            name="search"
          />
        }
      >
        {/* TRYING TO PASS THE SEARCH BAR FROM HERE...
        BECAUSE CORRESPONDING STYLE "search-desktop" IS AVAILABLE ONLY IN
        PRODUCTS.CSS */}
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={(e) => {
          //const respData = performSearch(e.target.value)
          //USING SETSTATE HERE THROWS ERROR!!!!
          //setArrayOfPdts(respData);

          // DOES CALLING SETTIMEOUT AGAIN CANCEL THE INITIAL CALL???
          const debounceTimeout = setTimeout(function () {
            performSearch(e.target.value);
          }, 500);
          debounceSearch(e, debounceTimeout);
        }}
        // ONLY HTML IS VISIBLE IN WEB PAGE INSPECT. HOW TO INSPECT REACT JS COMPONENTS??????
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item className="product-grid">
          {/* THIS HAD TO BE SPECIFIED AS STRING .. "10rem". Here, overrode the height in 
          Products.css */}
          <Box className="hero" sx={{ height: "15rem" }}>
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
      </Grid>

      {/* HOW TO GET SPACING BETWEEN HERO IMAGE AND FIRST ROW???? */}
      <Grid container rowSpacing={1} columnSpacing={2} justifyContent="center">
        {searchBarIsEmpty &&
          !isLoading &&
          arrayOfPdts.map((pdtInfo) => (
            <Grid item md={3} xs={6} key={pdtInfo._id}>
              <ProductCard product={pdtInfo}></ProductCard>
            </Grid>
          ))}

        {/* CLEAN UP THE MULTIPLE CONDITIONAL RENDERING!!!!! */}
        {!searchBarIsEmpty &&
          !noResultsFound &&
          arrayOfPdts.map((pdtInfo) => (
            <Grid item md={3} xs={6} key={pdtInfo._id}>
              <ProductCard product={pdtInfo}></ProductCard>
            </Grid>
          ))}
      </Grid>

      {!searchBarIsEmpty && noResultsFound && (
        <Grid
          container
          justifyContent="center"
          direction="column"
          alignItems="center"
          sx={{ height: "15rem" }}
        >
          <SentimentDissatisfied />
          No products found
        </Grid>
      )}

      {/* WHY SPECIFY CONTAINER????? */}
      {/* Time to provide height like in CSS...*/}
      {isLoading && (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "15rem" }}
        >
          <CircularProgress />
          Loading Products
        </Grid>
      )}

      {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
      <Footer />
    </div>
  );
};

export default Products;
