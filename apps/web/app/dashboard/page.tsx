"use client";

import {
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  // Optional: Simulate async fetch
  const [stats, setStats] = useState<null | DashboardCardProps[]>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats([
        { title: "Total Users", value: "1,204", icon: <FiUsers /> },
        { title: "Total Accounts", value: "832", icon: <FiDollarSign /> },
        { title: "Active Loans", value: "349", icon: <FiBarChart2 /> },
        { title: "Profit This Year", value: "₹2.5L", icon: <FiTrendingUp /> },
      ]);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats ? (
          stats.map((stat, idx) => (
            <DashboardCard
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))
        ) : (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}
      </div>

      {/* Chart Placeholder */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Monthly Reports</h2>
        <div className="h-60 flex items-center justify-center text-gray-400">
          📊 Chart/graph component will appear here
        </div>
      </div>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between">
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="text-blue-500 text-3xl">{icon}</div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-6 bg-gray-400 rounded w-1/2"></div>
    </div>
  );
}
