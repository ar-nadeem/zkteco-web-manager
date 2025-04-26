from datetime import datetime, time
from pydantic import BaseModel, Field
from typing import List, Optional


class AttendanceRecord(BaseModel):
    """Individual attendance record for a single punch."""
    uid: str = Field(..., description="User ID from the ZKTeco device")
    name: str = Field(..., description="Employee name")
    date: str = Field(...,
                      description="Human readable date (e.g., '21 April Monday 2025')")
    time: str = Field(...,
                      description="Time in 12-hour format (e.g., '09:15 AM')")
    is_late_arrival: bool = Field(...,
                                  description="Whether this was a late arrival")
    is_early_departure: bool = Field(...,
                                     description="Whether this was an early departure")
    first_punch: str = Field(..., description="First punch time for the day")
    last_punch: str = Field(..., description="Last punch time for the day")


class AttendanceMetadata(BaseModel):
    """Metadata about the attendance records."""
    total_records: int = Field(...,
                               description="Total number of attendance records")
    total_employees: int = Field(...,
                                 description="Total number of unique employees")
    date_range: dict = Field(...,
                             description="Start and end dates of the records")
    generated_at: datetime = Field(...,
                                   description="Timestamp when the data was generated")


class AttendanceResponse(BaseModel):
    """Complete attendance response including summary, detailed records and metadata."""
    summary: List[dict] = Field(
        ..., description="Summary of attendance records grouped by date and name")
    detailed: List[AttendanceRecord] = Field(...,
                                             description="Detailed attendance records")
    metadata: AttendanceMetadata = Field(
        ..., description="Metadata about the attendance records")


class AttendanceSettings(BaseModel):
    """Settings for attendance processing."""
    office_start: time = Field(default=time(
        9, 0), description="Office start time (default: 9:00 AM)")
    office_end: time = Field(default=time(
        17, 0), description="Office end time (default: 5:00 PM)")
    grace_period: int = Field(
        default=15, description="Grace period in minutes (default: 15)")
