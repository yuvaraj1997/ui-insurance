import {
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Stack,
    Typography,
  } from "@mui/material";
import { useDashboard } from "../context/DashboardContext";
  
  
  export default function DashboardProfile() {
    const { user } = useDashboard();

    if (!user) {
      return (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      );
    }
  
    return (
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Profile
          </Typography>
  
          <Typography variant="body1">
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </Typography>
  
          <Typography variant="body1">
            <strong>Email:</strong> {user.email}
          </Typography>
  
          <Typography variant="body1" sx={{ mt: 1 }} component="div">
            <strong>Status:</strong>{" "}
            <Chip
              label={user.status}
              color={user.status === "ACTIVE" ? "success" : "default"}
              size="small"
            />
          </Typography>
  
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Roles:</strong>
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            {user.roles.map((role) => (
              <Chip key={role} label={role} color="primary" size="small" />
            ))}
          </Stack>
  
          <Typography variant="body2" sx={{ mt: 2 }}>
            <strong>Created At:</strong>{" "}
            {user.createdAt}
          </Typography>
  
          <Typography variant="body2">
            <strong>Updated At:</strong>{" "}
            {user.updatedAt}
          </Typography>
        </CardContent>
      </Card>
    );
  }
  