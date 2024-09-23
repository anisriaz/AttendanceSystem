"use client"

import { useEffect, useState } from 'react';
import AddNewStudent from './_components/addNewStudent';
import StudentListTable from './_components/StudetnListTable';
import ApplicationForm from './_components/addApplications';
import { Button } from '@/components/ui/button';

const Student = ({ showActions = false, showApplicationForm = true }: { showActions?: boolean, showApplicationForm?: boolean }) => {
  const [studentList, setStudentList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
      setShowForm((prev) => !prev);
  };

  useEffect(() => {
      getStudent();
  }, []);

  async function getStudent() {
      try {
          const response = await fetch("http://localhost:3000/api/student", {
              cache: "no-store"
          });

          if (!response.ok) {
              throw new Error(`Failed to fetch data. Status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Data from API:", data);
          setStudentList(data);

      } catch (error: any) {
          console.error("Error fetching data:", error.message);
          return null;
      }
  }

  return (
      <div className='p-7'>
          <h2 className='font-bold text-2xl flex justify-between items-center'>
              Students
              <AddNewStudent />
          </h2>
          <StudentListTable studentList={studentList} showActions={showActions} initialData={null} />
          {/* Conditional rendering for the application form */}
          {showApplicationForm && (
              <div className="mt-1">
                  <Button onClick={toggleForm}>
                      {showForm ? "Hide Application Form" : "Write Application"}
                  </Button>

                  {showForm && (
                      <div className="mt-4">
                          <ApplicationForm />
                      </div>
                  )}
              </div>
          )}
      </div>
  );
}

export default Student;



function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

function setError(arg0: string) {
  throw new Error('Function not implemented.');
}

