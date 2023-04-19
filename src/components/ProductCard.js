import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Rating } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  const { name, cost, rating, image } = product;
  return (
    <Card className="card">
      <CardActionArea>
        <CardMedia
          component="img"
          height="280"
          image={image}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {name}
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            ${cost}
          </Typography>
          <br />
          <Rating name="read-only" value={rating} readOnly />
        </CardContent>
      </CardActionArea>
      <CardActions className='card-actions'>
        <Button className='card-button' variant='contained' size="big" color="primary" startIcon={<AddShoppingCartIcon />} style={{'width':'100%'}} onClick={handleAddToCart}>
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
    
  );
};

export default ProductCard;
