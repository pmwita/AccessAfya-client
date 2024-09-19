import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Typography, Grid, Paper, Button, AppBar, Toolbar, IconButton } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Chart as ChartJSCore,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ErrorBoundary from './ErrorBoundary';

// Register the components from Chart.js
ChartJSCore.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const GET_METRICS = gql`
  query GetMetrics {
    metrics {
      name
      value
    }
  }
`;

const App: React.FC = () => {
  const { loading, error, data } = useQuery(GET_METRICS);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Prepare metrics data for the bar chart
  const metricsData = {
    labels: data.metrics.map((metric: { name: string }) => metric.name),
    datasets: [
      {
        label: 'Metrics Values',
        data: data.metrics.map((metric: { value: number }) => metric.value),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Filter data based on selected metric
  const selectedValue = selectedMetric
    ? data.metrics.find((metric: { name: string }) => metric.name === selectedMetric)?.value || 0
    : 0;

  const selectedData = {
    labels: selectedMetric ? [selectedMetric] : [],
    datasets: [
      {
        label: 'Selected Metric Value',
        data: selectedMetric ? [selectedValue] : [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Line chart data that reflects selected metric
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: selectedMetric ? `Trend for ${selectedMetric}` : 'Access to Primary Care',
        data: selectedMetric
          ? [
              selectedValue * 0.1,
              selectedValue * 0.2,
              selectedValue * 0.15,
              selectedValue * 0.25,
              selectedValue * 0.3,
              selectedValue * 0.4,
            ]
          : [10, 20, 15, 25, 30, 40],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Access Afya Kenya LTD</Typography>
        </Toolbar>
      </AppBar>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {data.metrics.map((metric: { name: string; value: number }) => (
              <Grid item xs={12} sm={6} key={metric.name}>
                <Paper style={{ padding: '16px' }}>
                  <Typography variant="h6">{metric.name}</Typography>
                  <Typography variant="h4">{metric.value}</Typography>
                  <Button onClick={() => setSelectedMetric(metric.name)}>View Details</Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">Bar Chart (All Metrics)</Typography>
          <Bar data={metricsData} options={{ responsive: true }} />
          {selectedMetric && (
            <>
              <Typography variant="h5">Bar Chart (Selected Metric)</Typography>
              <Bar data={selectedData} options={{ responsive: true }} />
              <Typography variant="h5">Line Chart</Typography>
              <Line data={lineChartData} options={{ responsive: true }} />
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

// Wrap App component with ErrorBoundary
const Root: React.FC = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default Root;
