import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import {
  InsurancePolicy,
  PolicyType,
  UserQuotePolicyResponse,
} from "../../../../types";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../../utils/api";
import { useNavigate } from "react-router-dom";

interface QuotationProps {
  policy: InsurancePolicy;
  data: any;
}

export default function QuotationDetails({ policy, data }: QuotationProps) {
  const navigate = useNavigate();

  const [generating, setGenerating] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [quotation, setQuotation] = useState<UserQuotePolicyResponse | null>();

  const [paying, setPaying] = useState(false);
  const [payingHasError, setPayingHasError] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadingHasError, setUploadingHasError] = useState(false);
  const [uploadingSuccess, setUploadingSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generated = useRef(false);

  useEffect(() => {
    if (generated.current) {
      return;
    }

    const generateQuotation = async () => {
      generated.current = true
      try {
        const request = {
          policyId: policy.id,
          identification: "random_for_now",
          home: data,
          auto: data,
          life: data,
        };
        const result = await api.generateQuotation(request);

        if (!result.success) {
          setHasError(true);
          return;
        }

        setQuotation(result.data);
        setGenerating(false);
      } catch (err) {
        setHasError(true);
      } finally {
        setGenerating(false);
      }
    };

    generateQuotation();
  }, []);

  if (generating) {
    return <CircularProgress />;
  }

  if (hasError || !quotation) {
    return <>Failed to generate quotation</>;
  }

  const handlePay = async () => {
    setPaying(true);
    setPayingHasError(false);

    try {
      const result = await api.pay(quotation.userQuoteId);

      if (!result.success) {
        setPayingHasError(true);
        return;
      }

      navigate(`/dashboard/policies/${result.data.userPolicyId}`, {
        replace: true,
      });
    } catch (err) {
      setPayingHasError(true);
    } finally {
      setPaying(false);
    }
  };

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    setUploadingHasError(false);
    setUploadingSuccess(false)
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const maxSizeInMB = 10;
      const isValidType = selectedFile.type === "application/pdf";
      const isValidSize = selectedFile.size <= maxSizeInMB * 1024 * 1024;

      if (!isValidType) {
        setUploading(false);
        resetInput()
        alert("Only PDF files are allowed.");
        return;
      }

      if (!isValidSize) {
        setUploading(false);
        resetInput()
        alert("File size must be 10MB or smaller.");
        return;
      }

      try {

        const result = await api.upload(quotation.userQuoteId, selectedFile);

        if (!result.success) {
          setUploadingHasError(true);
          return;
        }
        
        setUploadingSuccess(true)
      } catch(error) {
        setUploadingHasError(true);
      }

    }
    setUploading(false);
  };

  return (
    <Card>
      <CardContent>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={paying || uploading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Typography variant="h6">Quoatation Details</Typography>
        <Typography variant="subtitle1">{policy.name}</Typography>
        <br />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <strong>Coverage Amount:</strong> RM{" "}
            {quotation.coverageAmount.toLocaleString()}
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <strong>Term Length:</strong> {quotation.termLengthInMonths} months
          </Grid>

          {quotation.policy.type.toLowerCase() ==
            PolicyType.HOME.toLowerCase() && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Property Type:</strong> {quotation.details.type}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Number of Rooms:</strong>{" "}
                {quotation.details.numberOfRooms}
              </Grid>
            </>
          )}

          {quotation.policy.type?.toLowerCase() ===
            PolicyType.LIFE.toLowerCase() && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Age:</strong> {quotation.details.age}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Health Status:</strong> {quotation.details.healthStatus}
              </Grid>
            </>
          )}

          {quotation.policy.type?.toLowerCase() ===
            PolicyType.AUTO.toLowerCase() && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Vehicle Type:</strong> {quotation.details.type}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Additional Driver:</strong>{" "}
                {quotation.details.additionalDriver ? "Yes" : "No"}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Natural Disaster Coverage:</strong>{" "}
                {quotation.details.naturalDisaster ? "Yes" : "No"}
              </Grid>
            </>
          )}

          <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: 4 }}>
            <strong>Quotation Breakdown:</strong>
            <br />
            <br />

            {quotation.quoteBreakdown.components.map((breakdown, index) => {
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
            <div>
              <strong>Total Premium</strong>: RM
              {quotation.quoteBreakdown.total.toLocaleString("en-MY", {
                minimumFractionDigits: 0,
              })}
            </div>
          </Grid>
        </Grid>
        <br />
        <strong>Additional Document Upload</strong> {" "}

        <input type="file" accept="application/pdf" onChange={handleFileChange} ref={fileInputRef}/>
        {uploadingSuccess && <Typography>Upload Success</Typography>}
        {uploadingHasError && <Typography>Upload Failed</Typography>}
        <br />
        {payingHasError && (
          <Typography color="red">
            Unable to process the payment at the moment.
          </Typography>
        )}
        
        <Grid sx={{ mt: 2, justifyContent: "end" }} container>
          <Grid>
            <Button variant="contained" color="success" onClick={handlePay} disabled={uploading || paying}>
              Pay
            </Button>
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
}
