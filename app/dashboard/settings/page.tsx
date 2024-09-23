import Student from "@/app/dashboard/students/page";
import { RoleGate } from "@/components/auth/roleGate";
import { UserRole } from "@prisma/client";
import AttendancePage from "@/app/dashboard/attendance/page"
import ApplicationPage from "@/app/dashboard/application/page";



const SetttingsPage = () => {


    return (
      <div>
        <div>
        <RoleGate allowedRole={UserRole.ADMIN}>
          <Student showActions={true} showApplicationForm={false}/>
          <AttendancePage showActions={true} />
          <ApplicationPage /> 
        </RoleGate>
      </div>
      </div>
    )
}

export default SetttingsPage;

