import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import { useState } from "react";
import React from "react";
import AdditionalInformationForm from "./component/AdditionalInformationForm";
import { InsurancePolicy, PoliciesResponse } from "../../../types";
import PolicyList from "./component/PolicyList";
import CoverageDetails from "./component/CoverageDetails";
import QuotationDetails from "./component/QuotationDetails";
import { api } from "../../../utils/api";

interface MyMap {
  [key: string]: string[];
}

const journeyTypes: MyMap = {
  auto: [
    "Select Insurance Type",
    "Policy List",
    "Coverage Details",
    "Information",
    "Quotation",
  ],
  life: [
    "Select Insurance Type",
    "Policy List",
    "Coverage Details",
    "Information",
    "Quotation",
  ],
  home: [
    "Select Insurance Type",
    "Policy List",
    "Coverage Details",
    "Information",
    "Quotation",
  ],
};

export default function NewUserPolicy() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 'sm' is usually ~600px

  
  const [steps, setSteps] = useState<string[]>(["Select Insurance Type"]);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [insuranceType, setInsuranceType] = useState<string>("");

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const [selectedPolicy, setSelectedPolicy] = useState<InsurancePolicy | null>(
    null
  );
  const [additionalInfo, setAdditionalInfo] = useState<any>(null);

  const [fetchingPolicy, setFetchingPolicy] = useState(false);
  const [policies, setPolicies] = useState<
    PoliciesResponse["policies"] | null
  >();

  const handlePolicySelect = (policy: InsurancePolicy) => {
    setSelectedPolicy(policy);
    handleNext();
  };

  const handleAdditionalInfoSubmit = (data: any) => {
    console.log("Additional info submitted:", data);
    // Save to state or pass to your final QuoteRequest
    setAdditionalInfo(data);
    handleNext();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((_, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  // const handleStep = (step: number) => () => setActiveStep(step);
  // const handleComplete = () => {
  //   setCompleted({ ...completed, [activeStep]: true });
  //   handleNext();
  // };

  const StepForms: Record<string, Record<string, React.ReactNode>> = {
    "Policy List": {
      auto: (
        <PolicyList
          policies={policies}
          onSelect={handlePolicySelect}
          fetchingPolicy={fetchingPolicy}
        />
      ),
      life: (
        <PolicyList
          policies={policies}
          onSelect={handlePolicySelect}
          fetchingPolicy={fetchingPolicy}
        />
      ),
      home: (
        <PolicyList
          policies={policies}
          onSelect={handlePolicySelect}
          fetchingPolicy={fetchingPolicy}
        />
      ),
    },
    "Coverage Details": {
      auto: (
        <CoverageDetails
          selectedPolicy={selectedPolicy!}
          onContinue={handleNext}
        />
      ),
      life: (
        <CoverageDetails
          selectedPolicy={selectedPolicy!}
          onContinue={handleNext}
        />
      ),
      home: (
        <CoverageDetails
          selectedPolicy={selectedPolicy!}
          onContinue={handleNext}
        />
      ),
    },
    Information: {
      auto: (
        <AdditionalInformationForm
          insuranceType="auto"
          onSubmit={handleAdditionalInfoSubmit}
        />
      ),
      life: (
        <AdditionalInformationForm
          insuranceType="life"
          onSubmit={handleAdditionalInfoSubmit}
        />
      ),
      home: (
        <AdditionalInformationForm
          insuranceType="home"
          onSubmit={handleAdditionalInfoSubmit}
        />
      ),
    },
    Quotation: {
      auto: <QuotationDetails policy={selectedPolicy!} data={additionalInfo} />,
      life: <QuotationDetails policy={selectedPolicy!} data={additionalInfo} />,
      home: <QuotationDetails policy={selectedPolicy!} data={additionalInfo} />,
    },
  };

  const handleChange = async (
    //@ts-ignore
    event: React.MouseEvent<HTMLElement>,
    insuranceType: string
  ) => {
    setInsuranceType(insuranceType);
    setSteps(journeyTypes[insuranceType]);
    setCompleted({});
    setActiveStep(1);

    setFetchingPolicy(true);

    try {
      const result = await api.getInsurancePoliciesByType(insuranceType);

      if (!result.success) {
        console.error("Error fetching insurance policies by type");
        return;
      }

      setPolicies(result.data.policies);
    } catch (err) {
      console.error("Error fetching insurance policies by type");
    } finally {
      setFetchingPolicy(false);
    }
  };

  const insuranceTypeSelector = () => (
    <ToggleButtonGroup
      color="primary"
      value={insuranceType}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="auto">Auto</ToggleButton>
      <ToggleButton value="life">Life</ToggleButton>
      <ToggleButton value="home">Home</ToggleButton>
    </ToggleButtonGroup>
  );

  const getStepContent = (label: string) => {
    if (label === "Select Insurance Type") return insuranceTypeSelector();
    const formGroup = StepForms[label];
    if (formGroup && insuranceType && formGroup[insuranceType]) {
      return formGroup[insuranceType];
    }
    return (
      <Typography>
        Coming soon for: {label} ({insuranceType})
      </Typography>
    );
  };

  return (
    <Container maxWidth="xl">
      <Card elevation={2} sx={{ width: "100%", padding: "8px" }}>
        <CardHeader title="New Policy" avatar={<ArticleIcon />} />
        <CardContent>
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} orientation={isMobile ? "vertical" : "horizontal"}>
              {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepLabel>{label}</StepLabel>
                  {isMobile &&  <StepContent>{getStepContent(label)}</StepContent>}
                 
                </Step>
              ))}
            </Stepper>
            
            {!isMobile && <div style={{ marginTop: "30px" }}>
              { getStepContent(steps[activeStep])}
              </div>}
            <div>
              <Typography sx={{ mt: 2, mb: 1, py: 1 }}></Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
              </Box>
            </div>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
