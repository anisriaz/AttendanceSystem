import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
    try {
        console.log("GET request received");
        const url = new URL(req.url);
        const studentId = url.pathname.split('/').pop(); 

        if (!studentId) {
            return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
        }
 
        const student = await db.student.findUnique({
            where: { id: studentId },
            include: { user: true }, 
        });

                return new NextResponse(JSON.stringify(student), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.log("[STUDENT_PATCH]", error);
        return new NextResponse("Internal error: ", { status: 500 });
}
}

// //UpPDATE API

export async function PATCH(req: Request) {
    try {
        console.log("PATCH request received");

        const url = new URL(req.url);
        const studentId = url.pathname.split('/').pop(); 

        if (!studentId) {
            return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
        }

        // Extract the updated data from the request body
        const data = await req.json();

        // Update the student in the database
        const updatedStudent = await db.student.update({
            where: { id: studentId },
            data: data, // Assuming 'data' contains the fields to update
            include: { user: true },
        });

        return new NextResponse(JSON.stringify(updatedStudent), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.log("[STUDENT_PATCH]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}


// ///DELTE API
export async function DELETE(req: Request) {
    try {
        console.log("DELETE request received");

        const url = new URL(req.url);
        const studentId = url.pathname.split('/').pop(); 

        if (!studentId) {
            return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
        }

        // Delete the student from the database
        await db.student.delete({
            where: { id: studentId },
        });

        return new NextResponse(JSON.stringify({ message: "Student deleted successfully" }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.log("[STUDENT_DELETE]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}

