from datetime import time
from app.zkteko.attendance.attendance_processor import AttendanceProcessor
from app.zkteko.attendance.file_manager import FileManager
import pandas as pd


class AttendanceManager:
    """Main class to manage attendance operations."""

    def __init__(self, ip: str, port: int = 4370, password: int = 0,
                 force_udp: bool = False, ommit_ping: bool = False, timeout: int = 5,
                 office_start: time = time(9, 0),
                 office_end: time = time(17, 0),
                 grace_period: int = 30):
        """Initialize AttendanceManager with all necessary components."""
        self.processor = AttendanceProcessor(
            ip=ip, port=port, password=password,
            force_udp=force_udp, ommit_ping=ommit_ping, timeout=timeout,
            office_start=office_start, office_end=office_end,
            grace_period=grace_period
        )
        self.file_manager = FileManager()

    def get_attendance_as_json(self):
        """Get attendance data in JSON format."""
        return self.processor.get_attendance_data()

    def process_and_save_attendance(self, output_dir: str = '.'):
        """Process attendance data and save to files."""
        try:
            # Get attendance data
            attendance_data = self.processor.get_attendance_data()

            # Create DataFrame from detailed records
            df_processed = pd.DataFrame(attendance_data['detailed'])

            # Save files
            self.file_manager.save_attendance_files(df_processed, output_dir)
            self.file_manager.save_attendance_json(attendance_data, output_dir)

            # Test Voice: Say Thank You
            self.processor.conn.test_voice()

            return True
        except Exception as e:
            print(f"Error processing and saving attendance: {e}")
            return False


# Example usage
if __name__ == "__main__":
    attendance_manager = AttendanceManager(ip="192.168.1.201")

    # Get attendance as JSON
    try:
        attendance_manager.process_and_save_attendance()
    except Exception as e:
        print(f"Error: {e}")
