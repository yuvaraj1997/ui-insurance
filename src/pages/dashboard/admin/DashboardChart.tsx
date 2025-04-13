import { CardContent, CircularProgress, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import { useDashboard } from "../context/DashboardContext";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { api } from "../../../utils/api";
import { DailyPolicyIssued } from "../../../types";

Chart.register(CategoryScale);

export default function DashboardChart() {
  const { user } = useDashboard();
  const [isLoading, setIsLoading] = useState(false);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Policy Issued ",
        data: [],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    const handleFetch = async () => {
      setIsLoading(true);
      try {
        const result = await api.adminDashboardPolicyIssued();
  
        if (!result.success) return;
  
        setChartData({
          labels: result.data.data.map((data: DailyPolicyIssued) => data.date),
          datasets: [
            {
              label: "Policy Issued",
              data: result.data.data.map((data: DailyPolicyIssued) => data.policiesIssued),
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
              ],
              borderColor: "black",
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (user && user.roles.includes("ADMIN")) {
      handleFetch();
    }
  }, [user]);

  if (!user || !user.roles.includes("ADMIN")) {
    return <></>;
  }

  return (
    <Card
      elevation={2}
      sx={(theme) => ({
        height: "auto",
        width: "100%",
        padding: "8px",
        cursor: "pointer",
        border: "2px solid transparent", // Set a default border (transparent in this case)
        ":hover": {
          borderColor: theme.palette.primary.main,
          borderWidth: "2px",
          borderStyle: "solid",
        },
        my: 2,
      })}
    >
      <CardContent>
        <Typography variant="h5">Policy issued</Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Bar
            data={chartData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Policy subscription last 7 days",
                },
                legend: {
                  display: false,
                },
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
