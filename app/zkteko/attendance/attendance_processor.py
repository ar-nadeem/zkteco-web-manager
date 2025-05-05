from datetime import datetime, time
import pandas as pd
from app.zkteko.base import ZktekoBase
from app.zkteko.user.user_manager import UserManager
import asyncio


class AttendanceProcessor(ZktekoBase):
    """Class to handle attendance processing operations."""

    def __init__(self, ip: str, port: int = 4370, password: int = 0,
                 force_udp: bool = False, ommit_ping: bool = False, timeout: int = 5,
                 office_start: time = time(9, 0),    # 9:00 AM
                 office_end: time = time(17, 0),     # 5:00 PM
                 grace_period: int = 15):            # 15 minutes grace period
        """Initialize AttendanceProcessor with device connection and timing parameters."""
        super().__init__(ip=ip, port=port, password=password,
                         force_udp=force_udp, ommit_ping=ommit_ping, timeout=timeout)

        self.office_start = office_start
        self.office_end = office_end
        self.grace_period = grace_period

        # Calculate grace times
        grace_minutes = datetime.min.replace(hour=self.office_start.hour,
                                             minute=self.office_start.minute)
        self.grace_start = (
            grace_minutes + pd.Timedelta(minutes=grace_period)).time()

        grace_minutes = datetime.min.replace(hour=self.office_end.hour,
                                             minute=self.office_end.minute)
        self.grace_end = (
            grace_minutes + pd.Timedelta(minutes=grace_period)).time()

        # Initialize user manager
        self.user_manager = UserManager(ip=ip, port=port, password=password,
                                        force_udp=force_udp, ommit_ping=ommit_ping,
                                        timeout=timeout)

    @staticmethod
    def format_date_human_readable(date_str):
        """Convert date string to human readable format."""
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        return date_obj.strftime('%d %B %A %Y')  # e.g., "16 April Monday 2024"

    def get_raw_attendance(self):
        """Get raw attendance records from device."""
        try:
            self.connect()
            return self.conn.get_attendance()
        finally:
            self.disconnect()

    def process_attendance_records(self):
        """Process attendance records and return processed data."""
        # Get user dictionary
        self.user_manager.setup_user_dictionary()

        # Get attendance records
        attendances = self.get_raw_attendance()
        allAttendances = []
        daily_punches = {}

        for attendance in attendances:
            try:
                user_id = int(attendance.user_id)
                name = self.user_manager.get_user_name(user_id)

                # Format the timestamp
                date = attendance.timestamp.strftime('%Y-%m-%d')
                human_readable_date = self.format_date_human_readable(date)
                time_str = attendance.timestamp.strftime('%I:%M %p')
                punch_time = attendance.timestamp.time()

                # Create a unique key for each person-day combination
                person_day_key = (name, date)

                # Track first and last punch
                if person_day_key not in daily_punches:
                    daily_punches[person_day_key] = {
                        'first_punch': punch_time,
                        'last_punch': punch_time,
                        'human_readable_date': human_readable_date
                    }
                else:
                    if punch_time < daily_punches[person_day_key]['first_punch']:
                        daily_punches[person_day_key]['first_punch'] = punch_time
                    if punch_time > daily_punches[person_day_key]['last_punch']:
                        daily_punches[person_day_key]['last_punch'] = punch_time

                allAttendances.append({
                    'uid': attendance.user_id,
                    'name': name,
                    'date': date,
                    'human_readable_date': human_readable_date,
                    'time': time_str,
                    'punch_time': punch_time
                })

            except (ValueError, TypeError) as e:
                print(f"Error processing attendance: {e}")
                continue

        return allAttendances, daily_punches

    def create_attendance_records(self, allAttendances, daily_punches):
        """Create processed attendance records."""
        df = pd.DataFrame(allAttendances)
        processed_records = []

        for (name, date), punches in daily_punches.items():
            first_punch = punches['first_punch']
            last_punch = punches['last_punch']
            human_readable_date = punches['human_readable_date']

            # Check for late arrival and early departure
            is_late = first_punch > self.grace_start
            left_early = last_punch < self.grace_end

            # Get all punches for this person-day
            day_records = df[(df['name'] == name) & (
                df['date'] == date)].sort_values('punch_time')

            for _, record in day_records.iterrows():
                processed_records.append({
                    'uid': record['uid'],
                    'name': name,
                    'date': human_readable_date,
                    'time': record['time'],
                    'is_late_arrival': is_late,
                    'is_early_departure': left_early,
                    'first_punch': first_punch.strftime('%I:%M %p'),
                    'last_punch': last_punch.strftime('%I:%M %p')
                })

        return pd.DataFrame(processed_records)

    def create_daily_summary(self, df_processed):
        """Create daily summary from processed records."""
        daily_summary = df_processed.groupby(['date', 'name']).agg({
            'time': 'count',
            'is_late_arrival': 'first',
            'is_early_departure': 'first',
            'first_punch': 'first',
            'last_punch': 'first'
        }).reset_index()

        daily_summary.columns = ['date', 'name', 'punch_count', 'is_late_arrival',
                                 'is_early_departure', 'first_punch', 'last_punch']

        return daily_summary

    async def get_attendance_data(self):
        """Get complete attendance data in structured format."""
        try:
            # Process attendance records
            allAttendances, daily_punches = self.process_attendance_records()

            # Create processed records
            df_processed = self.create_attendance_records(
                allAttendances, daily_punches)

            # Create daily summary
            daily_summary = self.create_daily_summary(df_processed)

            # Create response data
            attendance_data = {
                'summary': daily_summary.to_dict('records'),
                'detailed': df_processed.to_dict('records'),
                'metadata': {
                    'total_records': len(df_processed),
                    'total_employees': len(df_processed['name'].unique()),
                    'date_range': {
                        'start': df_processed['date'].min(),
                        'end': df_processed['date'].max()
                    },
                    'generated_at': datetime.now().isoformat()
                }
            }

            return attendance_data

        except Exception as e:
            print(f"Error getting attendance data: {e}")
            raise e
