import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
    try {
        console.log("GET request received");
        const url = new URL(req.url);
        const attendanceId = url.pathname.split('/').pop(); 

        if (!attendanceId) {
            return NextResponse.json({ message: "Attandance ID is required" }, { status: 400 });
        }
 
        const attendance = await db.attendance.findUnique({
            where: { id: attendanceId },
            include: { user: true }, 
        });

                return new NextResponse(JSON.stringify(attendance), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.log("[ATTENDANCE_PATCH]", error);
        return new NextResponse("Internal error: ", { status: 500 });
}
}

// //UpPDATE API

export async function PATCH(req: Request) {
    try {
        console.log("PATCH request received");

        const url = new URL(req.url);
        const attendanceId = url.pathname.split('/').pop(); 

        if (!attendanceId) {
            return NextResponse.json({ message: "Attendance ID is required" }, { status: 400 });
        }

        // Extract the updated data from the request body
        const data = await req.json();

        // Update the student in the database
        const updatedattendance = await db.attendance.update({
            where: { id: attendanceId },
            data: data, 
            include: { user: true },
        });

        return new NextResponse(JSON.stringify(updatedattendance), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.log("[ATTENDANCE_PATCH]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}


// ///DELTE API

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const attendanceId = url.pathname.split('/').pop();

    if (!attendanceId) {
        return NextResponse.json({ message: "Attendance ID is required" }, { status: 400 });
    }

    try {
        const attendance = await db.attendance.delete({
            where: { id: attendanceId },
        });
        return NextResponse.json({ message: "Attendance deleted successfully", attendance }, { status: 200 });
    } catch (error) {
        console.log("[ATTENDANCE_DELETE]", error);
        return NextResponse.json({ message: "Attendance record not found" }, { status: 404 });
    }
}
