import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StandardUserDashboardStats } from "../../types";
import { api } from "../../utils/api";
import DashboardChart from "./admin/DashboardChart";

export default function DashboardHome() {

  const [summary, setSummary] = useState<StandardUserDashboardStats>({
    activePolicies: 0,
    pendingApplications: 0,
  })

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
      const fetchSummary = async () => {
        try {
          const result = await api.dashboardSummary();

          if (!result.success) {
            setErrorMessage("Unable to fetch the summary")
            return;
          }

          setSummary(result.data);
        } catch (error) {
          setErrorMessage("Unable to fetch the summary")
        }
      }

      fetchSummary()
  }, [])

  return (
    <Container maxWidth="xl">
      {errorMessage && <Typography color="red">{errorMessage}</Typography> }
      
      <DashboardChart />
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <SummaryComponent label="Active Policies" value={summary.activePolicies} path="policies" />
        </Grid>
        {/* <Grid size={{ xs: 6 }}>
          <SummaryComponent label="Pending Application" value={summary.pendingApplications} path="#" />
        </Grid> */}
      </Grid>

      
    </Container>
  );
}

interface SummaryProps {
  label: string;
  value: number;
  path: string;
}

function SummaryComponent({ label, value, path }: SummaryProps) {
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
          borderStyle: "solid",
        },
      })}
      onClick={() => {
        navigate(path);
      }}
    >
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <Grid>
            <Typography variant="body1">{label}</Typography>
          </Grid>
          <Grid>
            <Typography variant="h3">{value}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
