import { Box, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        py: 3,
        mt: 2,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} InsuranceApp. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center">
          <Link to="#" style={{color: "white"}}>
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link to="#" style={{color: "white"}}>
            Terms of Service
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
