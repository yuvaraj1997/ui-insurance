import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { PolicyListProps } from "../../../../types";

export default function PolicyList({
  policies,
  onSelect,
  fetchingPolicy,
}: PolicyListProps) {
  if (fetchingPolicy) {
    return <CircularProgress />;
  }

  if (!policies) {
    return <>No insuranec policy to be shown.</>;
  }

  return (
    <Grid container spacing={2}>
      {policies.map((policy) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={policy.id}>
          <Card>
            <CardActionArea onClick={() => onSelect(policy)}>
              <CardContent>
                <Typography variant="h6">{policy.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Coverage amount: RM {" "}
                  {policy.coverageAmount.toLocaleString("en-MY", {
                    minimumFractionDigits: 0,
                  })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Premium from: RM {" "}
                  {policy.premiumPerMonth.toLocaleString("en-MY", {
                    minimumFractionDigits: 0,
                  })}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
