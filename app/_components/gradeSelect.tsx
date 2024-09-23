"use client"


import { useState, useEffect } from 'react';

type Student = {
  id: string;
  userId: string;
  fullName: string;
  addClass: string;
  mobileNumber: string;
  address: string;
};

interface GradeListProps {
  onClassSelect: (selectedClass: string) => void;
}

const GradeList: React.FC<GradeListProps> = ({ onClassSelect }) => {
  const [classOptions, setClassOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClassOptions();
  }, []);

  async function fetchClassOptions() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/student", { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data: Student[] = await response.json();
      console.log("Data from API:", data);

      // Extract unique class options from the API response
      const classes = Array.from(new Set(data.map(student => student.addClass).filter(cls => cls)));
      setClassOptions(classes);

    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <select
        className="border p-2 rounded-lg"
        onChange={(e) => onClassSelect(e.target.value as string)}
      >
        <option value="" disabled>Select a class</option>
        {classOptions.map((cls) => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GradeList;




