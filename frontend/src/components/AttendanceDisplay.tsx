import React, { useState, useMemo } from "react";
import { AttendanceDisplayProps, AttendanceSummary } from "../types/attendance";
import { format, parse } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AttendanceDisplay: React.FC<AttendanceDisplayProps> = ({
  data,
  isLoading,
  error,
}) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["all"]);
  const [nameFilter, setNameFilter] = useState<string>("");

  const parseDisplayDate = (dateStr: string): Date => {
    // Parse date in format "08 April Tuesday 2025"
    return parse(dateStr, "dd MMMM EEEE yyyy", new Date());
  };

  const filteredData = useMemo(() => {
    if (!data?.summary) return [];
    
    return data.summary.filter((record) => {
      // Date range filter
      const recordDate = parseDisplayDate(record.date);
      const matchesDate = (!startDate || recordDate >= startDate) && 
                         (!endDate || recordDate <= endDate);
      
      // Name filter
      const matchesName = !nameFilter || 
        record.name.toLowerCase().includes(nameFilter.toLowerCase());
      
      // Status filter
      const matchesStatus = selectedStatuses.includes("all") || 
        (selectedStatuses.includes("late") && record.is_late_arrival) ||
        (selectedStatuses.includes("early") && record.is_early_departure) ||
        (selectedStatuses.includes("ontime") && !record.is_late_arrival && !record.is_early_departure);
      
      return matchesDate && matchesName && matchesStatus;
    });
  }, [data, startDate, endDate, selectedStatuses, nameFilter]);

  const handleStatusChange = (status: string) => {
    if (status === "all") {
      setSelectedStatuses(["all"]);
    } else {
      setSelectedStatuses(prev => {
        const newStatuses = prev.filter(s => s !== "all");
        if (newStatuses.includes(status)) {
          return newStatuses.filter(s => s !== status);
        }
        return [...newStatuses, status];
      });
    }
  };

  const handleDownloadCSV = () => {
    if (!filteredData.length) return;

    const headers = ["Date", "Name", "Punches", "First Punch", "Last Punch", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(record => {
        const status = record.is_late_arrival ? "Late Arrival" : 
                      record.is_early_departure ? "Early Departure" : "On Time";
        return [
          record.date,
          `"${record.name}"`,
          record.punch_count,
          record.first_punch,
          record.last_punch,
          status
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Attendance Summary</h3>
        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Download CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            isClearable={true}
            placeholderText="Select date range"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="dd MMMM yyyy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Search by name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selectedStatuses.includes("all")}
                onChange={() => handleStatusChange("all")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">All</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selectedStatuses.includes("late")}
                onChange={() => handleStatusChange("late")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Late Arrival</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selectedStatuses.includes("early")}
                onChange={() => handleStatusChange("early")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Early Departure</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selectedStatuses.includes("ontime")}
                onChange={() => handleStatusChange("ontime")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">On Time</span>
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[600px] border border-gray-200 rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
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
            {filteredData.map((record, index) => (
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
