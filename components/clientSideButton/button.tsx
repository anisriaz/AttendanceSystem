"use client"; 

import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";

const ClientButton = () => {
    const router = useRouter();

    const handleNavigate = () => {
        router.push("/dashboard/application");
    };

    return (
        <Button onClick={handleNavigate}>
            Go to Attendance
        </Button>
    );
};

export default ClientButton;
