import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line,Pie } from "react-chartjs-2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Filler,
  Tooltip as ChartJSTooltip,
  Legend as ChartJSLegend,
} from "chart.js";

import './Chart.css'

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Filler,
  ChartJSTooltip,
  ChartJSLegend
);

// Utility to generate random colors
const generateColors = (count) =>
  Array.from({ length: count }, () => `hsl(${Math.random() * 360}, 70%, 60%)`);

// Utility function to format numbers

// Helper function to calculate monthly data
const calculateMonthlyData = (invoices) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Create a map with all months initialized to default values
  const dataMap = new Map(
    monthNames.map((month) => [
      month,
      { month, invoiceCount: 0, totalPrice: 0 },
    ])
  );

  // Process each invoice to aggregate data
  invoices.forEach((invoice) => {
    const invoiceDate = new Date(invoice.date);
    const month = monthNames[invoiceDate.getMonth()]; // Get month name

    const monthData = dataMap.get(month);
    monthData.invoiceCount += 1;
    monthData.totalPrice += invoice.total; // Aggregate total price
  });

  // Convert map to an array and return sorted data
  return Array.from(dataMap.values()).sort((a, b) => {
    return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
  });
};

// Rest of the code remains unchanged

// Line Chart Component
const LineChart = ({ data }) => {
  const months = data.map((item) => item.month);
  const invoiceCounts = data.map((item) => item.invoiceCount);
  const totalPrices = data.map((item) => item.totalPrice); // Use totalPrice instead of price

  const chartConfig = {
    labels: months,
    datasets: [
      {
        label: "Invoice Count",
        data: invoiceCounts,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Total Price (₹)",
        data: totalPrices, // Correct dataset key
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (tooltipItem) => {
            const datasetLabel = tooltipItem.dataset.label || "";
            const value = tooltipItem.raw;
            if (tooltipItem.datasetIndex === 0) {
              return `${datasetLabel}: ${value} invoices`;
            } else if (tooltipItem.datasetIndex === 1) {
              return `${datasetLabel}: ₹${value}`;
            }
            return `${datasetLabel}: ${value}`;
          },
        },
      },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="Container" style={{background:'white', marginTop:'15px'}}>
      <h2 style={{ textAlign: "center" }}>Monthly Invoice and Price Summary</h2>
      <Line data={chartConfig} options={options} />
    </div>
  );
};

// Grouped Bar Chart Component
const GroupedBarChart = ({ chartData }) => {
  return (
    <div className="Container" style={{background:'white', marginTop:'15px'}}>
      <h3 style={{ textAlign: "center" }}>
        Month-Wise Invoice Count and Total Price
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 25, left: 25, bottom: 5 }}
        >
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Invoice Count") return [`${value} invoices`, name];
              if (name === "Total Price") return [`₹${value}`, name];
              return [value, name];
            }}
          />
          <Legend />
          <Bar dataKey="invoiceCount" fill="#8884d8" name="Invoice Count" />
          <Bar dataKey="totalPrice" fill="#82ca9d" name="Total Price" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Pie Chart Component
const PieChart = ({ data }) => {
  const filteredData = data.filter((item) => item.invoiceCount > 0);

  const totalPriceChartData = {
    labels: filteredData.map((item) => item.month),
    datasets: [
      {
        label: "Total Price",
        data: filteredData.map((item) => item.totalPrice),
        backgroundColor: generateColors(filteredData.length),
        borderWidth: 1,
      },
    ],
  };

  const invoiceCountChartData = {
    labels: filteredData.map((item) => item.month),
    datasets: [
      {
        label: "Invoice Count",
        data: filteredData.map((item) => item.invoiceCount),
        backgroundColor: generateColors(filteredData.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const datasetLabel = tooltipItem.dataset.label || "";
            const value = tooltipItem.raw;
            const total = tooltipItem.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0
            );
            const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
            return `${datasetLabel}: ₹${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container ">
      <h2 style={{ textAlign: 'center' }}>Monthly Invoice Analysis</h2>
      <div className="chart-wrapper">
        <div className="chart-box">
          <h3>Total Price Distribution (Month-wise)</h3>
          <Pie data={totalPriceChartData} options={options} />
        </div>
        <div className="chart-box">
          <h3>Invoice Count Distribution (Month-wise)</h3>
          <Pie data={invoiceCountChartData} options={options} />
        </div>
      </div>
    </div>
  );
  
};

// Parent Component
const Charts = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get("http://localhost:4000/api/invoices", {
          headers,
        });
        const monthlyData = calculateMonthlyData(response.data.invoices);
        setData(monthlyData);
      } catch (err) {
        setError("Failed to fetch invoice data. Please try again.");
      }
    };
    fetchData();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div className="Container" style={{background:'white', marginTop:'15px'}}>
        <LineChart data={data} />
        <GroupedBarChart chartData={data} />
        <PieChart data={data} />
    </div>
  );
};

export default Charts;
