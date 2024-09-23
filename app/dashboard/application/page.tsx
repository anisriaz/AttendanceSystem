"use client"

import { useEffect, useState } from "react";
import axios from "axios";


type Application = {
    id: string; 
    content: string;
    fullName: string;
};

const ApplicationPage = () => {
    const [applications, setApplications] = useState<Application[]>([]);

    const fetchApplications = async () => {
        const response = await axios.get("/api/application");
        setApplications(response.data);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Submitted Applications</h2>
        <ul className="space-y-2">
            {applications.map((app) => (
                <li key={app.id} className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200">
                    <strong className="block text-lg">{app.fullName}</strong>
                    <p className="text-gray-700">{app.content}</p>
                </li>
            ))}
        </ul>
    </div>
    
    );
};

export default ApplicationPage;

