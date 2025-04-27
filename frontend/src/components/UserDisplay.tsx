import React, { useState, useMemo } from "react";
import {UsersDisplayProps } from "../types/user";

const UserDisplay: React.FC<UsersDisplayProps> = ({
  data,
  isLoading,
  error,
}) => {
  const [nameFilter, setNameFilter] = useState<string>("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter((user) => {
      // Name filter
      return !nameFilter || 
        user.name.toLowerCase().includes(nameFilter.toLowerCase());
    });
  }, [data, nameFilter]);

  if (isLoading) {
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse flex justify-center items-center">
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
        <div className="text-gray-500">No users found.</div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Users</h3>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search by Name
        </label>
        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Search by name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto max-h-[600px] border border-gray-200 rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                User ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Privilege
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Group ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Card
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr
                key={user.user_id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 text-sm text-gray-900">
                  {user.user_id}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {user.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {user.privilege}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {user.group_id}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {user.card}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDisplay;
