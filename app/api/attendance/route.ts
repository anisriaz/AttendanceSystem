import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";


export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const monthParam = url.searchParams.get("month");

        if (monthParam) {
            const startDate = new Date(monthParam);
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

            const attendanceRecords = await db.attendance.findMany({
                where: {
                    date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                include: {
                    student: true,
                },
            });

            // Calculate total days attended and grades
            interface AttendanceRecord {
                id: string;
                fullName: string;
                totalDaysAttended: number;
            }
            
            const attendanceMap: Record<string, AttendanceRecord> = {};
            
            attendanceRecords.forEach(record => {
                const studentId = record.studentId;
                if (!attendanceMap[studentId]) {
                    attendanceMap[studentId] = {
                        id: studentId,
                        fullName: record.student.fullName || "Unknown Student",
                        totalDaysAttended: 0,
                    };
                }
                if (record.present) {
                    attendanceMap[studentId].totalDaysAttended += 1;
                }
            });
            
            const csvData = Object.values(attendanceMap).map(student => {
                const { id, fullName, totalDaysAttended } = student;
                let grade;

                if (totalDaysAttended === 0) {
                    grade = "D";
                } else if (totalDaysAttended >= 10 && totalDaysAttended < 25) {
                    grade = "C";
                } else if (totalDaysAttended >= 25) {
                    grade = "A+";
                } else {
                    grade = "D";
                }

                return {
                    studentId: id,
                    totalDaysAttended,
                    grade,
                    fullName,
                };
            });

            const csvString = [
                ["Student ID", "Total Days Attended", "Grade", "Full Name"],
                ...csvData.map(row => [row.studentId, row.totalDaysAttended, row.grade, row.fullName]),
            ]
            .map(e => e.join(",")) 
            .join("\n");

            return new NextResponse(csvString, {
                status: 200,
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": "attachment; filename=attendance-report.csv",
                },
            });
        }

        const usersWithAttendance = await db.student.findMany({
            include: {
                attendance: true,
            },
        });

        const studentsWithAttendance = usersWithAttendance.map(student => ({
            id: student.id,
            fullName: student.fullName,
            addClass: student.addClass,
            attendance: student.attendance.map(attendanceRecord => ({
                id: attendanceRecord.id,
                studentId: attendanceRecord.studentId,
                present: attendanceRecord.present,
                day: attendanceRecord.day,
                date: attendanceRecord.date,
            })),
        }));

        return NextResponse.json(studentsWithAttendance, { status: 200 });

    } catch (error) {
        console.error("[STUDENTS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}



export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        const body = await req.json();
        const { present, day, date } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const student = await db.student.findFirst({
            where: { userId },
        });

        if (!student) {
            return new NextResponse("Student not found for this user", { status: 404 });
        }


        if (present === undefined) {
            return new NextResponse("Present status is required", { status: 400 });
        }
        if (day === undefined) {
            return new NextResponse("Day is required", { status: 400 });
        }
        if (!date) {
            return new NextResponse("Date is required", { status: 400 });
        }

        const attendance = await db.attendance.create({
            data: {
                studentId: student.id,  
                present,
                day,
                date: new Date(date),  
                userId,               
            }
        });

        return new NextResponse(JSON.stringify(attendance), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('[ATTENDANCE_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
