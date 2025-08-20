"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function LoanAnalyticsChart() {
  const chartData = {
    labels: ["Home", "Car", "Personal", "Education"],
    datasets: [
      {
        label: "Loans Issued",
        data: [20, 15, 25, 5],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="font-semibold text-lg mb-3">Loan Analytics</h2>
      <Bar data={chartData} />
    </div>
  );
}
