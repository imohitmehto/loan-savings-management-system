"use client";

import React from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchAllAccounts } from "@/lib/api/accounts";
import { fetchAllAccountGroup } from "@/lib/api/accountGroups";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorState from "../common/ErrorState";
import { Users, CheckCircle, Clock, XCircle, Ban, Layers } from "lucide-react";
import { useRouter } from "next/navigation";

interface StatusCardProps {
  label: string;
  count: number;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  onViewClick: () => void;
}

function StatusCard({
  label,
  count,
  color,
  bgColor,
  icon,
  onViewClick,
}: StatusCardProps) {
  return (
    <div
      className={`p-4 rounded-lg shadow-sm border ${bgColor} flex flex-col items-start`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className={`font-semibold ${color}`}>{label}</span>
      </div>
      <span className="text-2xl font-bold text-gray-900">{count}</span>
      <button
        onClick={onViewClick}
        className={`mt-4 px-3 py-1 rounded ${color.replace(
          "text-",
          "bg-",
        )} text-white text-sm hover:brightness-90 transition`}
      >
        View
      </button>
    </div>
  );
}

interface TotalCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  onViewAllClick: () => void;
  buttonBgColor: string;
}

function TotalCard({
  label,
  count,
  icon,
  bgColor,
  textColor,
  onViewAllClick,
  buttonBgColor,
}: TotalCardProps) {
  return (
    <div
      className={`p-4 rounded-lg shadow-sm border ${bgColor} flex flex-col items-center`}
    >
      <div className="mb-2">{icon}</div>
      <p className={`text-sm font-medium ${textColor}`}>{label}</p>
      <p className="text-3xl font-bold text-gray-900 mb-4">{count}</p>
      <button
        onClick={onViewAllClick}
        className={`w-4/5 px-4 py-2 rounded-md ${buttonBgColor} text-white hover:brightness-90 transition`}
      >
        View All {label}
      </button>
    </div>
  );
}

export default function AccountOverview() {
  const {
    data: accounts,
    loading: loadingAccounts,
    error: errorAccounts,
  } = useFetchData(fetchAllAccounts);

  const {
    data: groups,
    loading: loadingGroups,
    error: errorGroups,
  } = useFetchData(fetchAllAccountGroup);

  const router = useRouter();

  if (loadingAccounts || loadingGroups) return <LoadingSpinner />;
  if (errorAccounts) return <ErrorState message={errorAccounts} />;
  if (errorGroups) return <ErrorState message={errorGroups} />;

  const totalCount = accounts?.length ?? 0;
  const totalGroups = groups?.length ?? 0;

  const statusCounts = {
    ACTIVE: accounts?.filter((a) => a.status === "ACTIVE").length ?? 0,
    PENDING: accounts?.filter((a) => a.status === "PENDING").length ?? 0,
    CLOSED: accounts?.filter((a) => a.status === "CLOSED").length ?? 0,
    SUSPENDED: accounts?.filter((a) => a.status === "SUSPENDED").length ?? 0,
  };

  const statusCardsData: StatusCardProps[] = [
    {
      label: "Active",
      count: statusCounts.ACTIVE,
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      onViewClick: () => router.push(`/account?status=active`),
    },
    {
      label: "Pending",
      count: statusCounts.PENDING,
      color: "text-yellow-800",
      bgColor: "bg-yellow-50",
      icon: <Clock className="w-6 h-6 text-yellow-500" />,
      onViewClick: () => router.push(`/account?status=pending`),
    },
    {
      label: "Closed",
      count: statusCounts.CLOSED,
      color: "text-gray-800",
      bgColor: "bg-gray-50",
      icon: <XCircle className="w-6 h-6 text-gray-500" />,
      onViewClick: () => router.push(`/account?status=closed`),
    },
    {
      label: "Suspended",
      count: statusCounts.SUSPENDED,
      color: "text-red-600",
      bgColor: "bg-red-50",
      icon: <Ban className="w-6 h-6 text-red-500" />,
      onViewClick: () => router.push(`/account?status=suspended`),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
      {/* Heading with React icon */}
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-semibold text-gray-900">
          Account Overview
        </h1>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statusCardsData.map((card) => (
          <StatusCard key={card.label} {...card} />
        ))}
      </div>

      {/* Total Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TotalCard
          label="Accounts"
          count={totalCount}
          icon={<Users className="w-8 h-8 text-blue-500" />}
          bgColor="bg-blue-50"
          textColor="text-gray-700"
          onViewAllClick={() => router.push("/account")}
          buttonBgColor="bg-blue-600 hover:bg-blue-700"
        />

        <TotalCard
          label="Account Groups"
          count={totalGroups}
          icon={<Layers className="w-8 h-8 text-purple-600" />}
          bgColor="bg-purple-50"
          textColor="text-gray-700"
          onViewAllClick={() => router.push("/account/group")}
          buttonBgColor="bg-purple-600 hover:bg-purple-700"
        />
      </div>
    </div>
  );
}
