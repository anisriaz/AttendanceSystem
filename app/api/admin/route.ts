import { CurrenttRole } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { NextResponse } from "next/server"


//GET ADMIN API
export async function GET() {
   const role = await CurrenttRole();


   if(role === UserRole.ADMIN) {
    return new NextResponse(null, { status: 200 });
   }

return new NextResponse(null, { status: 403 });
}