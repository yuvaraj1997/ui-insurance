import { Typography, Card, CardContent, Button, Grid } from "@mui/material";
import { CoverageDetailsProps } from "../../../../types";

export default function CoverageDetails({
  selectedPolicy,
  onContinue,
}: CoverageDetailsProps) {
  if (!selectedPolicy) {
    return (
      <Typography>Please select a policy to view coverage details.</Typography>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Coverage Details</Typography>
        <br />
        <Typography variant="subtitle1">{selectedPolicy.name}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Coverage amount: RM{" "}
          {selectedPolicy.coverageAmount.toLocaleString("en-MY", {
            minimumFractionDigits: 0,
          })}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Premium from: RM{" "}{selectedPolicy.premiumPerMonth}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Term: {selectedPolicy.termLengthInMonths} Months
        </Typography>
        <Grid sx={{ mt: 2, justifyContent: "end" }} container>
          <Grid>
            <Button variant="contained" onClick={onContinue}>
              Continue
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
