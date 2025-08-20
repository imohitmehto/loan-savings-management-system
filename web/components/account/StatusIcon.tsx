import React from "react";
import { Account } from "@/types/Account";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

interface StatusIconProps {
  status: Account["status"];
}

export default function StatusIcon({ status }: StatusIconProps) {
  switch (status) {
    case "ACTIVE":
      return (
        <CheckCircleIcon
          className="h-5 w-5 text-green-500"
          title="Active"
          aria-label="Active"
        />
      );
    case "INACTIVE":
      return (
        <ClockIcon
          className="h-5 w-5 text-yellow-500"
          title="Inactive"
          aria-label="Inactive"
        />
      );
    case "SUSPENDED":
      return (
        <XCircleIcon
          className="h-5 w-5 text-red-500"
          title="Suspended"
          aria-label="Suspended"
        />
      );
    default:
      return null;
  }
}
