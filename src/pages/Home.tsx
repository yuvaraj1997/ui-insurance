import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import autoImage from "../assets/producs/vehicle.png";
import lifeImage from "../assets/producs/life.png";
import homeImage from "../assets/producs/home.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h5">
        <b>Explore our products</b>
      </Typography>
      <br />
      <Grid container spacing={4}>
        <Grid size={{ xs: 6, md: 4 }}>
          <ProductComponent label="Auto" image={autoImage} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <ProductComponent label="Home" image={homeImage} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <ProductComponent label="Life" image={lifeImage} />
        </Grid>
      </Grid>
    </Container>
  );
}

interface ProductProps {
  label: string;
  image: string;
}

function ProductComponent({ label, image }: ProductProps) {

  const navigate = useNavigate();

  return (
    <Card
      elevation={2}
      sx={(theme) => ({
        height: "150px",
        width: "100%",
        padding: "8px",
        cursor: "pointer",
        border: "2px solid transparent", // Set a default border (transparent in this case)
        ":hover": {
            borderColor: theme.palette.primary.main,
            borderWidth: "2px",
            borderStyle: "solid"
        }
      })}
      onClick={() => {
        navigate('/dashboard/policies/new')
      }}
    >
      <CardContent>
        <Grid
          container
          direction="column"
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid>
            <img 
                src={image}
                style={{
                    width: "70px",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  alt={label}
            />
          </Grid>
          <Grid>
            <Typography variant="body1">{label}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
