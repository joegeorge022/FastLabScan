export interface Student {
  regNo: string;
  timestamp: number;
}

export interface SessionConfig {
  department: string;
  year: number;
  duration: number;
}

export interface AttendanceSession {
  id: string;
  date: number;
  department: string;
  year: number;
  students: Student[];
} 