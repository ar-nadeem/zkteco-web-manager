import React, { useState, useMemo,useEffect } from "react";
import AttendanceDisplay from "./AttendanceDisplay";
import UserDisplay from "./UserDisplay";
import { attendanceAPI, userAPI } from "../apiHandler/calls";
import { DeviceSettings } from "../apiHandler/types";
import { QuickActionsProps, AttendanceData } from "../types/attendance";
import { ViewIcon, UsersIcon } from "./icons";
import { User } from "../types/user";
const QuickActions: React.FC<QuickActionsProps> = ({
  isDisabled,
  zkSettings,
}) => {
  const [showAttendance, setShowAttendance] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );
  const [usersData, setUsersData] = useState<User[] | null>(null);
  const [showUsers, setShowUsers] = useState(false);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  if (showUsers) {
    setShowAttendance(false);
  }
 }, [showUsers]);

 useEffect(() => {
  if (showAttendance) {
    setShowUsers(false);
  }
 }, [showAttendance]);

  // Convert ZKTecoSettings to DeviceSettings with proper type conversion
  const deviceSettings = useMemo<Partial<DeviceSettings>>(
    () => ({
      ip: zkSettings.ip,
      port: parseInt(zkSettings.port, 10),
      password: zkSettings.password,
      timeout: 10, // default timeout
    }),
    [zkSettings]
  );

  const fetchAttendanceData = async () => {
    setIsAttendanceLoading(true);
    setError(null);
    try {
      const data = await attendanceAPI.getAttendance(
        deviceSettings as DeviceSettings
      );
      setAttendanceData(data);
      setShowAttendance(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching attendance data"
      );
    } finally {
      setIsAttendanceLoading(false);
    }
  };

  const fetchUsersData = async () => {
    setIsUsersLoading(true);
    setError(null);
    try {
      const data = await userAPI.getUsers(deviceSettings as DeviceSettings);
      console.log(data);
      setUsersData(data as User[]);
      setShowUsers(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching users data");
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleViewAttendance = () => {
    if (!showAttendance) {
      fetchAttendanceData();
    } else {
      setShowAttendance(false);
    }
  };

  const handleManageUsers = () => {
    if (!showUsers) {
      fetchUsersData();
    } else {
      setShowUsers(false);
    }
  };
  

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          className={`p-4 border rounded-lg
            ${
              isDisabled
                ? "bg-gray-200 text-gray-500"
                : "hover:bg-black hover:text-white"
            }
            transition-colors duration-200
            flex items-center justify-center gap-2`}
          disabled={isDisabled || isAttendanceLoading}
          onClick={handleViewAttendance}
        >
          <ViewIcon />
          {isAttendanceLoading ? "Loading..." : showAttendance ? "Hide Attendance" : "View Attendance Records"}
        </button>
        <button
          className={`p-4 border rounded-lg
            ${
              isDisabled
                ? "bg-gray-200 text-gray-500"
                : "hover:bg-black hover:text-white"
            }
            transition-colors duration-200
            flex items-center justify-center gap-2`}
          disabled={isDisabled || isUsersLoading}
          onClick={handleManageUsers}
        >
          <UsersIcon />
          {isUsersLoading ? "Loading..." : "Manage Users"}
        </button>
      </div>
      {showAttendance && (
        <AttendanceDisplay
          data={attendanceData}
          isLoading={isAttendanceLoading}
          error={error}
        />
      )}
      {showUsers && (
        <UserDisplay
          data={usersData}
          isLoading={isUsersLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default QuickActions;
