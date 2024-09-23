import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";



//Get Api
export async function GET(req: Request) {
    try {
        const students = await db.student.findMany();

        //Response
        return NextResponse.json(students, { status: 200 });

    } catch (error) {
        console.log("[STUDENT_GET]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}





//POST API
export async function POST(req: Request) {
    try {
        const user = await currentUser(); 
        const userId = user?.id; 
        const body = await req.json();
        const { fullName, addClass, mobileNumber, address, } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!fullName) {
            return new NextResponse("Name is Required", { status: 400 });
        }
        if (!addClass) {
            return new NextResponse("Class is Required", { status: 400 });
        }
        if (!mobileNumber) {
            return new NextResponse("Parent Number is Required", { status: 400 });
        }
        if (!address) {
            return new NextResponse("Address is Required", { status: 400 });
        }
        // if (!imageUrl) {
        //     return new NextResponse("Image is Required", { status: 400 });
        // }

        const student = await db.student.create({
            data: {
                fullName,
                addClass,
                mobileNumber,
                address,
                userId, 
            }
        });

    //     return new NextResponse(JSON.stringify(student), { status: 201 });

    // } catch (error) {
    //     return new NextResponse("Internal Server Error", { status: 500 });
    // }
      // Return a success response if store creation is successful
      return new NextResponse(JSON.stringify(student), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('[STUDENT_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}




