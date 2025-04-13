import {
  Backdrop,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { PolicyDetails, UserPolicyPaymentList } from "../../../types";
import { api } from "../../../utils/api";
import { Link } from "react-router-dom";

export default function PolicyDetail() {
  const { userPolicyId } = useParams();

  const [policy, setPolicy] = useState<PolicyDetails | null>(null);
  const [policyPayments, setPolicyPayments] =
    useState<UserPolicyPaymentList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasPaymentError, setHasPaymentError] = useState(false);
  const [tabValue, setTabValue] = useState("1");
  const navigate = useNavigate();

  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  //@ts-ignore
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (!userPolicyId) return;

    const fetchUserPolicyDetail = async () => {
      try {
        const result = await api.getUserPolicyDetail(userPolicyId);

        if (!result.success || !result.data) {
          setHasError(true);
          return;
        }

        setPolicy(result.data);
      } catch (error) {
        console.error("Failed to fetch user policy:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPolicyDetail();
  }, [userPolicyId]);

  useEffect(() => {
    if (hasError) {
      navigate(-1); // Safe to call inside a separate effect
    }
  }, [hasError, navigate]);

  useEffect(() => {
    if (!policy || !userPolicyId) return;

    const fetchUserPolicyPayments = async () => {
      try {
        const result = await api.getUserPolicyPayments(userPolicyId);

        if (!result.success || !result.data) {
          setHasPaymentError(true);
          return;
        }

        setPolicyPayments(result.data);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        setHasPaymentError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPolicyPayments();
  }, [policy, userPolicyId]);

  if (isLoading) {
    return <>Loading...</>;
  }

  // Safe guard fallback (if somehow data is still null)
  if (!policy) {
    return <>Something went wrong...</>; // Or redirect again, depending on UX
  }

  const convertDateToLocal = (dateString: string) => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(false);

    try {
      const result = await api.getFile(policy.userPolicy.userPolicyId);

      if (!result.success) {
        setDownloadError(true);
        return;
      }

      const file = new Blob([result.data], { type: "application/pdf" }); // or use appropriate content type
      const fileURL = URL.createObjectURL(file);

      // Create an anchor element and trigger download
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `document-${policy.userPolicy.userPolicyId}.pdf`;
      link.click();

      // Cleanup
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
    console.log("download");
  };

  return (
    <Container maxWidth="xl">
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={downloading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card
        elevation={2}
        sx={{
          width: "100%",
          padding: "8px",
        }}
      >
        <CardHeader title={policy.policy.name} avatar={<ArticleIcon />} />
        <CardContent>
          <Grid container spacing={1}>
            <Grid container direction="column" spacing={1} sx={{ flexGrow: 1 }}>
              <Grid>
                <Typography variant="body1" component="div">
                  <Chip label={policy.policy.type} /> | #
                  {policy.userPolicy.userPolicyId} | {policy.userPolicy.status}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="column" spacing={1}>
              <Grid>
                <Typography variant="body1">Policy Coverage</Typography>
              </Grid>
              <Grid>
                <Typography>
                  <b>
                    RM{" "}
                    {policy.userPolicy.coverageAmount.toLocaleString("en-MY", {
                      minimumFractionDigits: 0,
                    })}
                  </b>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <TabContext value={tabValue}>
            {hasPaymentError && (
              <Typography color="red">Unable to get payment list</Typography>
            )}
            
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Overview" value="1" />
                <Tab label="Payments" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ padding: 0, mt: 2 }}>
              <Grid container spacing={4}>
                <LabelComponent
                  label="Premium Amount"
                  value={
                    "RM " +
                    policy.userPolicy.monthlyPremiumAmount.toLocaleString(
                      "en-MY",
                      {
                        minimumFractionDigits: 0,
                      }
                    )
                  }
                />
                <LabelComponent
                  label="Payment Mode"
                  value={policy.userPolicy.paymentMode}
                />
                <LabelComponent
                  label="Payment Due Date"
                  value={convertDateToLocal(policy.userPolicy.paymentDueDate)}
                />
                <LabelComponent
                  label="Term"
                  value={`${policy.userPolicy.termInMonths} Months`}
                />
                <LabelComponent
                  label="Start Date"
                  value={convertDateToLocal(policy.userPolicy.startDate)}
                />
                <LabelComponent
                  label="End Date"
                  value={convertDateToLocal(policy.userPolicy.endDate)}
                />
                <LabelComponent
                  label="Term Remaining"
                  value={`${policy.userPolicy.termRemainingInMonths} Months`}
                />
              </Grid>
              <br />
              <br />
              <strong>Premium Breakdown:</strong>
              <br />
              <br />

              {policy.quoteBreakdown.components.map((breakdown, index) => {
                return (
                  <div key={index}>
                    <strong>{breakdown.description}</strong>: RM
                    {breakdown.amount.toLocaleString("en-MY", {
                      minimumFractionDigits: 0,
                    })}
                  </div>
                );
              })}

              <br />

              {policy.userPolicy.haveDocument && (
                <Link
                  to="#"
                  onClick={() => {
                    handleDownload();
                  }}
                >
                  Download Document
                </Link>
              )}
              {downloadError && (
                <Typography color="red">Unable to download</Typography>
              )}
            </TabPanel>
            <TabPanel value="2" sx={{ padding: 0, mt: 2 }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Month</TableCell>
                      <TableCell align="center">Amount</TableCell>
                      <TableCell align="center">Payment Date</TableCell>
                      <TableCell align="center">Billing Schedule</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {policyPayments &&
                      policyPayments.map((payment) => (
                        <TableRow
                          key={payment.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row" align="center">
                            {payment.month}
                          </TableCell>
                          <TableCell align="center">
                            {"RM " +
                              policy.userPolicy.monthlyPremiumAmount.toLocaleString(
                                "en-MY",
                                {
                                  minimumFractionDigits: 0,
                                }
                              )}
                          </TableCell>
                          <TableCell align="center">
                            {payment.paymentDate
                              ? convertDateToLocal(payment.paymentDate)
                              : "-"}
                          </TableCell>
                          <TableCell align="center">
                            {payment.billingSchedule
                              ? convertDateToLocal(payment.billingSchedule)
                              : "-"}
                          </TableCell>
                          <TableCell align="center">{payment.status}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabContext>
        </CardContent>
      </Card>
    </Container>
  );
}

function LabelComponent({ label, value }: { label: string; value: string }) {
  return (
    <Grid size={{ xs: 6, md: 4, lg: 2 }}>
      <Grid spacing={1} direction="column" container>
        <Grid>{label}</Grid>
        <Grid>
          <b>{value}</b>
        </Grid>
      </Grid>
    </Grid>
  );
}
