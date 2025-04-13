import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Policy, PolicyProps } from "../../../types";
import { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { Link } from "react-router-dom";



export default function MyPolicy() {

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PolicyProps['policies']>();
  

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const result = await api.ownPolicies()

        if (!result.success) {
          return;
        }

        setData(result.data.policies);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false)
      }
    } 

    fetchPolicies()
  }, [])
  
  if (loading) {
    return <CircularProgress />
  }

  return (
    <Container maxWidth="xl">
      <Card
        elevation={2}
        sx={{
          width: "100%",
          padding: "8px",
        }}
      >
        <CardHeader title="My Policies" avatar={<DashboardIcon />} />
        <CardContent>
          {data && data.map((policy) => (
            <PolicyComponent key={policy.userPolicyId} policy={policy} />
          ))}
        </CardContent>
      </Card>
    </Container>
  );
}

interface PolicyComponentProps {
  policy: Policy;
}

function PolicyComponent({ policy }: PolicyComponentProps) {
  return (
    <Card
      elevation={2}
      sx={{
        width: "100%",
        padding: "8px",
        my: "10px",
      }}
    >
      <CardContent>
        <Grid container spacing={1}>
          <Grid container direction="column" spacing={1} sx={{flexGrow: 1}}>
            <Grid>
              <Typography variant="body1" component="div">
              <Chip label={policy.type} /> | #{policy.userPolicyId} | {policy.status}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="h5">{policy.name}</Typography>
            </Grid>
          </Grid>
          <Grid container direction="column" spacing={1}>
            <Grid>
              <Typography variant="body1">
              Policy Coverage
              </Typography>
            </Grid>
            <Grid>
                <Typography>RM {policy.coverageAmount.toLocaleString('en-MY', { minimumFractionDigits: 0 })}</Typography>
            </Grid>
            <Grid>
                <br />
                <Link to={`${policy.userPolicyId}`}>
                More Details
                </Link>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
