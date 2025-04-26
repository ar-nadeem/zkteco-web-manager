export interface ZKTecoSettings {
  ip: string;
  password: string;
  port: string;
}

export interface AttendanceSummary {
  date: string;
  name: string;
  punch_count: number;
  is_late_arrival: boolean;
  is_early_departure: boolean;
  first_punch: string;
  last_punch: string;
}

export interface AttendanceData {
  summary: AttendanceSummary[];
}

export interface AttendanceDisplayProps {
  data: AttendanceData | null;
  isLoading: boolean;
  error: string | null;
}

export interface QuickActionsProps {
  isDisabled: boolean;
  zkSettings: ZKTecoSettings;
} 