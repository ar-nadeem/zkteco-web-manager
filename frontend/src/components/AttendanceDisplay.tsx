import React from "react";
import { AttendanceDisplayProps } from "../types/attendance";

const AttendanceDisplay: React.FC<AttendanceDisplayProps> = ({
  data,
  isLoading,
  error,
}) => {
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

  if (!data?.summary || data.summary.length === 0) {
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
        <div className="text-gray-500">No attendance records found.</div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Attendance Summary</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Punches
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                First Punch
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Last Punch
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.summary.map((record, index) => (
              <tr
                key={`${record.date}-${record.name}-${index}`}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 text-sm text-gray-900">
                  {record.date}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {record.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {record.punch_count}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {record.first_punch}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {record.last_punch}
                </td>
                <td className="px-4 py-2 text-sm">
                  <div className="flex gap-2">
                    {record.is_late_arrival && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Late Arrival
                      </span>
                    )}
                    {record.is_early_departure && (
                      <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                        Early Departure
                      </span>
                    )}
                    {!record.is_late_arrival && !record.is_early_departure && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        On Time
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceDisplay;
