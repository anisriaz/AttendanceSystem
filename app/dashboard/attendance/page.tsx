"use client"

import { useState } from "react";
import MonthSelection from "@/app/_components/MonthSelection";
import { Button } from "@/components/ui/button";
import GradeList from "@/app/_components/gradeSelect";
import { useForm } from "react-hook-form";
import moment from "moment";
import AttendanceGrid from "./_components/attendanceGrid";

type Inputs = {
    studentId: string;
    present: boolean;
    day: string;
    date: Date;
};

interface AttendancePageProps {
    showActions?: boolean;
}

const AttendancePage = ({ showActions = false }: AttendancePageProps) => {
    const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
    const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
    const [attendanceList, setAttendanceList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>();

    const onSearchHandler = async () => {
        const month = moment(selectedMonth).format("MM-YYYY");

        try {
            setLoading(true);
            const response = await fetch("http://localhost:3000/api/attendance", {
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch data. Status: ${response.status}`);
            }

            const data = await response.json();
            setAttendanceList(data); // Update state with fetched data
        } catch (error: any) {
            console.error("Error fetching data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateGrades = (attendanceData: any[]) => {
        return attendanceData.map(student => {
            const totalDaysAttended = student.attendance?.filter((att: { present: any; }) => att.present).length || 0;
            let grade;

            if (totalDaysAttended === 0) {
                grade = "D";
            } else if (totalDaysAttended >= 10 && totalDaysAttended < 25) {
                grade = "C";
            } else if (totalDaysAttended >= 25) {
                grade = "A+";
            } else {
                grade = "D"; // Default grade
            }

            return {
                ...student,
                totalDaysAttended,
                grade,
            };
        });
    };

    const handleDownloadReport = async () => {
        if (!selectedMonth) {
            console.error("Please select a month before downloading the report.");
            return;
        }

        const month = moment(selectedMonth).format("YYYY-MM");
        const response = await fetch(`/api/attendance?month=${month}`);

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = "attendance-report.csv";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            console.error("Failed to download report");
        }
    };

    return (
      <div className="p-10 bg-gray-50 min-h-screen">
    <h2 className="text-3xl font-bold mb-6">Attendance</h2>
    <div className="flex gap-5 my-5 p-5 border border-gray-300 rounded-lg shadow-sm bg-white">
        <div className="flex gap-2 items-center">
            <label className="font-medium">Select Month</label>
            <MonthSelection onMonthChange={(value) => setSelectedMonth(value)} />
        </div>
        <div className="flex gap-2 items-center">
            <label className="font-medium">Select Class</label>
            <GradeList onClassSelect={(value: string) => setSelectedClass(value)} />
        </div>
        <Button onClick={onSearchHandler} disabled={loading} className="bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-md px-4 py-2">
            {loading ? 'Loading...' : 'Search'}
        </Button>
    </div>

    <div className="p-4 bg-white rounded-lg shadow-md">
        <AttendanceGrid
            attendanceList={attendanceList}
            selectedMonth={selectedMonth ? moment(selectedMonth).format("YYYY-MM") : ""}
            showActions={showActions}
        />
        {showActions && (
            <div className="mt-4 flex flex-col items-start">
                <Button 
                    onClick={handleDownloadReport} 
                    className="bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-md px-4 py-2"
                >
                 Download Attendance Report
                </Button>
            </div>
        )}
    </div>
</div>

    
    );
};

export default AttendancePage;



  function setStudentList(data: any) {
    throw new Error("Function not implemented.");
  }

function getStudent(selectedClass: string | undefined, any: any, month: string, any1: any) {
  throw new Error("Function not implemented.");
}

