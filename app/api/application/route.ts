import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";



//Get Api
// export async function GET(req: Request) {
//     try {
//         const applications = await db.application.findMany();

//         //Response
//         return NextResponse.json(applications, { status: 200 });

//     } catch (error) {
//         console.log("[APPLICTION_GET]", error);
//         return new NextResponse("Internal error: ", { status: 500 });
//     }
// }

export async function GET(req: Request) {
    try {
        const applications = await db.application.findMany({
            include: {
                student: {
                    select: {
                        fullName: true, 
                    },
                },
            },
        });

        return NextResponse.json(applications, { status: 200 });

    } catch (error) {
        console.error("[APPLICATION_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}




//POST API

// export async function POST(req: Request) {
//     try {
//         const user = await currentUser();
//         const userId = user?.id;

//         const body = await req.json();
//         const { content,  } = body;

//         if (!userId) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         const student = await db.student.findFirst({
//             where: { userId },
//         });

//         if (!student) {
//             return new NextResponse("Student not found for this user", { status: 404 });
//         }


//         if (content === undefined) {
//             return new NextResponse("Content is required", { status: 400 });
//         }
      

//         const application = await db.application.create({
//             data: {
//                 studentId: student.id,  
//                 content,            
//             }
//         });

//         return new NextResponse(JSON.stringify(application), {
//             status: 201,
//             headers: { 'Content-Type': 'application/json' }
//         });

//     } catch (error) {
//         console.error('[APPLICATION_POST]', error);
//         return new NextResponse("Internal Server Error", { status: 500 });
//     }
// }


export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { content } = body;

        if (!content) {
            return new NextResponse("Content is required", { status: 400 });
        }

        const student = await db.student.findFirst({
            where: { userId },
        });

        if (!student) {
            return new NextResponse("Student not found for this user", { status: 404 });
        }

        const application = await db.application.create({
            data: {
                studentId: student.id,
                content,
            },
        });

        return new NextResponse(JSON.stringify(application), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('[APPLICATION_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
