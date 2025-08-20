"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export default function SalesAnalyticsChart() {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Transactions",
        data: [120, 180, 150, 200, 250],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192,0.2)",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="font-semibold text-lg mb-3">Transaction Trends</h2>
      <Line data={chartData} />
    </div>
  );
}
