"use client";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchAllAccountGroup } from "@/lib/api/accountGroups";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorState from "../common/ErrorState";

export default function AccountGroupsOverview() {
  const { data: groups, loading, error } = useFetchData(fetchAllAccountGroup);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="font-semibold text-lg mb-3">Account Groups</h2>
      {groups?.map((g) => (
        <p key={g.id}>
          {g.name} — {g.accounts?.length ?? 0} Accounts
        </p>
      ))}
    </div>
  );
}
