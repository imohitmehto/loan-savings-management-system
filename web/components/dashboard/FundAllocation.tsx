import { GrMoney } from "react-icons/gr";
import FundAllocationPieChart from "./FundAllocationPieChart";
import FundAllocationTable from "./FundAllocationTable";
export default function FundAllocation() {
  const data = [
    { name: "Bank", value: 40000 },
    { name: "FD", value: 25000 },
    { name: "Loan", value: 15000 },
    { name: "Cash", value: 10000 },
  ];
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
      {/* Heading with React icon */}
      <div className="flex items-center gap-3 mb-6">
        <GrMoney className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-semibold text-gray-900">Funds Overview</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FundAllocationPieChart data={data} />
        <FundAllocationTable data={data} />
      </div>
    </div>
  );
}
