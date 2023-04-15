import { AddShoppingCartOutlined } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import { AddShoppingCart } from "@mui/icons-material";
import { CardActionArea } from "@mui/material";

// HOW TO MAKE THE IMAGE DISPLAY FROM TOP AND NOT FROM CENTRE???????
// const useStyles = makeStyles({
//   card: {},
//   media: { height: 300 },
//   text: { fontWeight: "bold" },
// });

const ProductCard = ({ product, handleAddToCart }) => {
  // const obj = {
  //   name: "Tan Leatherette Weekender Duffle",
  //   category: "Fashion",
  //   cost: 150,
  //   rating: 4,
  //   image:
  //     "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  //   id: "PmInA797xJhMIPti",
  // };

  // const classes = useStyles();

  //const [rating, setRating] = useState(4);

  //useEffect(() => {console.log("The product is:", product)},[])

  return (
    <Card className="card">
      <CardActionArea>
        <CardMedia
          sx={{ height: 300 }}
          // className={classes.media}
          component="img"
          image={product.image}
        ></CardMedia>
        <CardContent>
          <Typography variant="subtitle1">{product.name}</Typography>
          <Typography variant="subtitle1" 
          sx = {{ fontWeight: "bold" }}
          // className={classes.text}
          >
            ${product.cost}
          </Typography>

          <Rating
            value={product.rating}
            readOnly
            // This is a read-only rating!!
            // onChange={(event, newRating) => {
            //   setRating(newRating);
            // }}
          />
        </CardContent>
      </CardActionArea>
      <Button
        variant="contained"
        startIcon={<AddShoppingCart />}
        name="add to cart"
      >
        ADD TO CART
      </Button>
    </Card>
  );
};

export default ProductCard;
