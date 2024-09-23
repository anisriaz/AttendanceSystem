"use client"

import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef } from 'ag-grid-community';
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from '@/components/ui/input';



import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Search, Trash } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';



type Inputs = {
  fullName: string;
  addClass: string;
  mobileNumber: string;
  address: string;
};


interface StudentListTableProps {
  initialData: Student | null;
}

interface Student {
  id: string;
  fullName: string;
  addClass: string;
  mobileNumber: string;
  address: string;
}

interface StudentListTableProps {
  studentList: Student[];
  showActions?: boolean;
}

const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 100, 150];


const StudentListTable: React.FC<StudentListTableProps> = ({ studentList, showActions}) => {

  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
 

//Edit Api
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!selectedStudent) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/student/${selectedStudent.id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      router.refresh();
      toast.success("Student updated successfully");
      setOpen(false);
      reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update student.');
    } finally {
      setLoading(false);
    }
  };

//Edit Api Button
  const CustomButtonEdit = (props: { data: Student }) => {
    const student = props.data;

    // Prepopulate form fields with student data
    React.useEffect(() => {
      if (student) {
        setValue("fullName", student.fullName);
        setValue("addClass", student.addClass);
        setValue("mobileNumber", student.mobileNumber);
        setValue("address", student.address);
      }
    }, [student, setValue]);

    return (
      <div>
        <Button onClick={() => { 
          setSelectedStudent(student); 
          setOpen(true); 
        }}>Edit</Button>
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='py-2'>
                    <label>Full Name</label>
                    <Input placeholder="John Snow" {...register("fullName", { required: true })} />
                  </div>
                  <div className='py-2'>
                    <label>Class</label>
                    <Input placeholder="7th" {...register("addClass", { required: true })} />
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
                    <Button type="button" onClick={() => setOpen(false)} variant="ghost">Cancel</Button>
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
 
  const CustomButton = (props: { data: { id: string } }) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="destructive">
            <Trash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteRecord(props.data.id)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
 
 
  // const CustomButton = (props: any) => {
  //   return (
  //     <AlertDialog>
  //       <AlertDialogTrigger> <Button variant="destructive">
  //         <Trash />
  //       </Button></AlertDialogTrigger>
  //       <AlertDialogContent>
  //         <AlertDialogHeader>
  //           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
  //           <AlertDialogDescription>
  //             This action cannot be undone. This will permanently delete your account
  //             and remove your data from our servers.
  //           </AlertDialogDescription>
  //         </AlertDialogHeader>
  //         <AlertDialogFooter>
  //           <AlertDialogCancel>Cancel</AlertDialogCancel>
  //           <AlertDialogAction onClick={() => deleteRecord(props?.data?.id)}>Continue</AlertDialogAction>
  //         </AlertDialogFooter>
  //       </AlertDialogContent>
  //     </AlertDialog>

  //   );
  // };

  const columnDefs: Array<ColDef<Student>> = [
    { headerName: "ID", field: "id", filter: true },
    { headerName: "Full Name", field: "fullName", filter: true },
    { headerName: "Class", field: "addClass", filter: true },
    { headerName: "Mobile Number", field: "mobileNumber", filter: true },
    { headerName: "Address", field: "address", filter: true },
    { headerName: "Action", cellRenderer: CustomButtonEdit,  },
    ...(showActions ? [{ headerName: "Action", cellRenderer: CustomButton }] : []),
  ];
  const [rowData, setRowData] = useState<Student[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  

  useEffect(() => {
    setRowData(studentList);
  }, [studentList]);


  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/student/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      router.refresh(); 
      router.push(`/dashboard/settings`);
      toast.success("Student deleted successfully");
      console.log("Delete response:", data);
      return data;
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student. Make sure you removed all associated data first.");
    }
  };


  return (
    <div className="my-7">
    {/* Display total count of students */}
    <div className="mb-4">
        <span>Total Students: {studentList.length}</span>
    </div>

    <div className="ag-theme-quartz">
        {/* Search bar */}
        <div className="p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm">
            <Search />
            <input 
                type="text" 
                placeholder="Search..."
                className="outline-none w-full"
                onChange={(event) => setSearchInput(event.target.value)}
            />
        </div>
        <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            quickFilterText={searchInput}
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
            domLayout="autoHeight" 
        />
    </div>
</div>

  );
}

export default StudentListTable;
