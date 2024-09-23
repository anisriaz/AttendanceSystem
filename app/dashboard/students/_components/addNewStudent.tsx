"use client"

import { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

type Inputs = {
  fullName: string;
  addClass: string;
  mobileNumber: string;
  address: string;
};

const AddNewStudent = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();


  //Post Api
  // const onSubmit = async (data: Inputs) => {
  //   try {
  //     setLoading(true); // Start loading spinner or disable button

  //     // Log the data you're sending
  //     console.log('Data being sent:', data);

  //     // Make a POST request using fetch
  //     const response = await fetch('/api/student', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data), // Stringify the data
  //     });

  //     // Log the response
  //     console.log('Fetch Response:', response);

  //     // Try to parse the response as JSON, but handle non-JSON responses
  //     let result;
  //     const contentType = response.headers.get('Content-Type');

  //     if (contentType && contentType.includes('application/json')) {
  //       result = await response.json(); // Parse JSON response
  //     } else {
  //       result = await response.text(); // Handle plain text (error messages)
  //     }

  //     // Check if the request was successful
  //     if (response.ok) {
  //       toast.success('Student added successfully!');
  //       console.log('API Result:', result); // Log the successful result
  //     } else {
  //       // Handle error responses (whether they are JSON or text)
  //       const errorMessage = typeof result === 'string' ? result : result.error;
  //       toast.error(errorMessage || 'Failed to add student. Please try again.');
  //       console.error('Error response:', result);
  //     }
  //   } catch (error) {
  //     // Log the error
  //     console.error('Fetch API Error:', error);

  //     // Show a generic error message
  //     toast.error('An error occurred while adding the student.');
  //   } finally {
  //     setLoading(false); // Stop loading spinner or enable button again
  //   }
  // };

  const onSubmit = async (data: Inputs) => {
    try {
      setLoading(true);
  
      const response = await axios.post('/api/student', data);
       // console.log('API Response:', response);
  
      if (response.data) {
        reset();
        setOpen(false);
        router.refresh();
        router.push(`/dashboard/students`);
        toast("Student Added");
      }
      if (response.status === 201) {
        toast.success('Student added successfully!');
      } else {
        toast.error('Failed to add student. Please try again.');
      }
    } catch (error: any) {
      console.error('API Error:', error);
  
      toast.error(error.response?.data?.error || 'An error occurred while adding the student.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>+ Add new Student</Button>
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new student</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='py-2'>
                  <label>Full Name</label>
                  <Input placeholder="John Snow" {...register("fullName", { required: true })} />
                </div>
                <div className='py-2'>
                <label htmlFor="addClass">Class</label>
                <select
                    id="addClass"
                    {...register("addClass", { required: true })}
                    className="border p-2 rounded"
                >
                    <option value="" disabled>Select a class</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                </select>
                {errors.addClass && <span className="text-red-500">This field is required</span>}
            </div>
                <div className='py-2'>
                  <label>Parents Number</label>
                  <Input placeholder="123456789" {...register("mobileNumber")} />
                </div>
                <div className='py-2'>
                  <label>Address</label>
                  <Input placeholder="525 City New York" {...register("address")} />
                </div>

                <div className="flex gap-3 items-center justify-end mt-5">
                  <Button type="button"  onClick={() => setOpen(false)} variant="ghost">Cancel</Button>
                  <Button type="submit" disabled={loading}>Save</Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewStudent;
