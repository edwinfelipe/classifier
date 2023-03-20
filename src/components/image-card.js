import React from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  Avatar,
  CardContent,
  Typography,
} from "@mui/material";
import { purple, red, yellow, pink, green } from "@mui/material/colors";

const ImageCard = ({ classification, trust, image, file }) => {
  const colors = {
    Rosa: red[500],
    Girasol: yellow[500],
    Orquidea: purple[500],
    Margarita: green[500],
    Clavel: pink[500],
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: colors[classification] }} aria-label="flower">
            {classification.substring(0, 1)}
          </Avatar>
        }
        title={classification}
        subheader={image}
      />
      <CardMedia
        component="img"
        height="194"
        image={URL.createObjectURL(file)}
        alt={classification}
      />
      <CardContent>
        <Typography variant="body2">
          Esta flor es una {classification} Con un {(trust * 100).toFixed(2)}%
          de confianza.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
