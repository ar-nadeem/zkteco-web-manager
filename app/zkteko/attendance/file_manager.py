import json
import pandas as pd
from pathlib import Path


class FileManager:
    """Class to handle file operations for attendance data."""

    @staticmethod
    def add_spacing_between_days(df):
        """Add spacing between different days in the DataFrame."""
        # Sort the dataframe by date and name
        df = df.sort_values(['date', 'name'])

        # Get unique dates
        unique_dates = df['date'].unique()

        # Create a new list to store rows with spacing
        rows_with_spacing = []

        # Process each date
        for date in unique_dates:
            # Add all rows for current date
            date_rows = df[df['date'] == date]
            rows_with_spacing.extend(date_rows.to_dict('records'))

            # Add an empty row after each date (except the last date)
            if date != unique_dates[-1]:
                empty_row = {col: '' for col in df.columns}
                rows_with_spacing.append(empty_row)

        # Create new DataFrame with spacing
        return pd.DataFrame(rows_with_spacing)

    @staticmethod
    def save_attendance_files(df_processed, output_dir: str = '.'):
        """Save attendance data to CSV files."""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        try:
            # Create daily summary
            daily_summary = df_processed.groupby(['date', 'name']).agg({
                'time': 'count',
                'is_late_arrival': 'first',
                'is_early_departure': 'first',
                'first_punch': 'first',
                'last_punch': 'first'
            }).reset_index()

            daily_summary.columns = ['date', 'name', 'punch_count', 'is_late_arrival',
                                     'is_early_departure', 'first_punch', 'last_punch']

            # Get detailed records
            detailed_records = df_processed.sort_values(
                ['date', 'name', 'time'])

            # Add spacing between days in both DataFrames
            daily_summary_spaced = FileManager.add_spacing_between_days(
                daily_summary)
            detailed_records_spaced = FileManager.add_spacing_between_days(
                detailed_records)

            # Save files
            summary_path = output_path / 'attendance_summary.csv'
            detailed_path = output_path / 'attendance_detailed.csv'

            daily_summary_spaced.to_csv(summary_path, index=False)
            detailed_records_spaced.to_csv(detailed_path, index=False)

            print("Files saved successfully:")
            print(
                f"1. {summary_path} - Shows daily punch count per person with late arrival and early departure status")
            print(
                f"2. {detailed_path} - Shows all punch details with timing status")

            return True

        except Exception as e:
            print(f"Error saving attendance files: {e}")
            return False

    @staticmethod
    def save_attendance_json(attendance_data: dict, output_dir: str = '.'):
        """Save attendance data to JSON file."""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        try:
            json_path = output_path / 'attendance_data.json'
            with open(json_path, 'w') as f:
                json.dump(attendance_data, f, indent=2)
            print(f"JSON data saved to {json_path}")
            return True
        except Exception as e:
            print(f"Error saving JSON data: {e}")
            return False
