"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ApplicationFormValues = {
    content: string;
};

const ApplicationForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ApplicationFormValues>();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit: SubmitHandler<ApplicationFormValues> = async (data) => {
        setLoading(true);
        try {
            await axios.post("/api/application", data);
            toast.success("Application submitted successfully");
            reset();
            router.push(`/dashboard/students`); 
        } catch (error) {
            toast.error("Failed to submit application");
            console.error("Submission error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <textarea 
                {...register("content", { required: true, minLength: 10 })} 
                placeholder="Write your application here..."
                className="w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.content && (
                <span className="text-red-500 text-sm">This field is required and must be at least 10 characters long.</span>
            )}
            <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition duration-200"
            >
                {loading ? "Submitting..." : "Submit Application"}
            </Button>
        </form>
    );
};

export default ApplicationForm;





