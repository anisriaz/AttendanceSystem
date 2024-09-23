import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface AttendanceRecord {
    id: string;
    fullName: string;
    attendance?: {
        id: string;
        studentId: string;
        present: boolean;
        day: string;
        date: string;
    }[];
    [key: string]: any;
}

interface AttendanceGridProps {
    attendanceList: AttendanceRecord[];
    selectedMonth: string;
    showActions?: boolean;
}

const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 100, 150];

const AttendanceGrid =  ({ attendanceList, selectedMonth, showActions = false }: AttendanceGridProps) => {
    const [rowData, setRowData] = useState<AttendanceRecord[]>([]);
    const [colDefs, setColDefs] = useState<ColDef<AttendanceRecord>[]>([]);

    useEffect(() => {
        const uniqueList = getUniqueRecord();
        setRowData(uniqueList);

        const newColDefs: ColDef<AttendanceRecord>[] = [
            { field: "id", headerName: "ID", width: 100 },
            { field: "fullName", headerName: "Full Name", width: 150 },
            { field: "totalDaysAttended", headerName: "Total Days Attended", width: 150 },
            { field: "grade", headerName: "Grade", width: 100 },
        ];

        const daysArray = Array.from({ length: moment(selectedMonth).daysInMonth() }, (_, i) => i + 1);

        daysArray.forEach((day) => {
            const fieldName = `day${day}`;
            newColDefs.push({
                field: fieldName,
                headerName: `${day}`,
                width: 50,
                cellRenderer: 'agCheckboxCellRenderer',
                editable: true,
                cellEditorParams: {
                    values: [true, false],
                },
            });

            uniqueList.forEach((obj) => {
                obj[fieldName] = isPresent(obj.id, day);
            });
        });

        setColDefs(newColDefs);
    }, [attendanceList, selectedMonth]);

    const getUniqueRecord = (): AttendanceRecord[] => {
        const uniqueRecord: AttendanceRecord[] = [];
        const existingUser = new Set<string>();

        attendanceList.forEach((record) => {
            if (!existingUser.has(record.id)) {
                existingUser.add(record.id);
                uniqueRecord.push(record);
            }
        });

        return uniqueRecord;
    };

    const isPresent = (studentId: string, day: number): boolean => {
        return attendanceList.some(item =>
            item.attendance?.some(att => att.studentId === studentId && moment(att.date).date() === day)
        );
    };

    const updateAttendance = async (studentId: string, day: number, newValue: boolean) => {
        const year = moment(selectedMonth).year();
        const month = moment(selectedMonth).month();
        const date = moment(new Date(year, month, day)).format('YYYY-MM-DD');

        const data = {
            studentId,
            present: newValue,
            day: day.toString(),
            date,
        };

        try {
            await axios.post("/api/attendance", data);
            toast.success(`Attendance updated for Student ID: ${studentId} on day ${day}`);
        } catch (error) {
            console.error("Error updating attendance:", error);
            toast.error("Failed to update attendance");
        }
    };

    const deleteAttendance = async (id: string) => {
        if (!showActions) {
            toast.error("You are not authorized to perform this action.");
            return;
        }
        
        console.log(`Attempting to delete attendance for ID: ${id}`);
    
        try {
            const response = await fetch(`/api/attendance/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${errorData.message || response.statusText}`);
            }
    
            const data = await response.json();
            toast.success(`Attendance deleted for Attendance ID: ${id}`);
            
            setRowData(prevRowData => 
                prevRowData.filter(record => record.id !== id)
            );
    
            console.log("Delete response:", data); // Log response data
        } catch (error) {
            console.error("Error deleting attendance:", error);
            toast.error("Failed to delete attendance");
        }
    };
    

    const onMarkAttendance = (field: string | undefined, studentId: string, newValue: boolean) => {
        if (field && studentId) {
            const day = parseInt(field.replace('day', ''), 10);
            setRowData(prevRowData =>
                prevRowData.map(record => {
                    if (record.id === studentId) {
                        return { ...record, [field]: newValue };
                    }
                    return record;
                })
            );

            if (newValue === false) {
                const attendanceId = findAttendanceId(studentId, day);
                if (attendanceId) {
                    deleteAttendance(attendanceId);
                } else {
                    toast.error("Attendance record not found");
                }
            } else {
                updateAttendance(studentId, day, newValue);
            }
        }
    };

    const findAttendanceId = (studentId: string, day: number): string | null => {
        for (const item of attendanceList) {
            if (item.attendance) {
                const attendanceRecord = item.attendance.find(att => {
                    const itemDay = moment(att.date).date();
                    return att.studentId === studentId && itemDay === day;
                });
                if (attendanceRecord) {
                    return attendanceRecord.id;
                }
            }
        }
        return null;
    };

    return (
        <div className="ag-theme-quartz">
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            domLayout='autoHeight'
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
            onCellValueChanged={(e) => onMarkAttendance(e.colDef.field, e.data.id, e.newValue)}
        />
      
    </div>
    
    );
};

export default AttendanceGrid;



























// import { useEffect, useState } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import { ColDef } from 'ag-grid-community';
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import moment from 'moment';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { useParams, useRouter } from "next/navigation";

// interface AttendanceRecord {
//     id: string;
//     fullName: string;
//     attendance?: {
//         id: string;
//         studentId: string;
//         present: boolean;
//         day: string;
//         date: string;
//     }[];
//     [key: string]: any;
// }

// const AttendanceGrid = ({ attendanceList, selectedMonth, canDelete }: { attendanceList: AttendanceRecord[], selectedMonth: string, canDelete: boolean }) => {
//     const [rowData, setRowData] = useState<AttendanceRecord[]>([]);
//     const [colDefs, setColDefs] = useState<ColDef<AttendanceRecord>[]>([]);

//     useEffect(() => {
//         const uniqueList = getUniqueRecord();
//         setRowData(uniqueList);
        
//         const newColDefs: ColDef<AttendanceRecord>[] = [
//             { field: "id", headerName: "ID", width: 100 },
//             { field: "fullName", headerName: "Full Name", width: 150 },
//         ];

//         const daysArray = Array.from({ length: moment(selectedMonth).daysInMonth() }, (_, i) => i + 1);
        
//         daysArray.forEach((day) => {
//             const fieldName = `day${day}`;
//             newColDefs.push({
//                 field: fieldName,
//                 headerName: `${day}`,
//                 width: 50,
//                 cellRenderer: 'agCheckboxCellRenderer',
//                 editable: true,
//                 cellEditorParams: {
//                     values: [true, false],
//                 },
//             });

//             uniqueList.forEach((obj) => {
//                 obj[fieldName] = isPresent(obj.id, day);
//             });
//         });

//         setColDefs(newColDefs);
//     }, [attendanceList, selectedMonth]);

//     const onMarkAttendance = (field: string | undefined, studentId: string, newValue: boolean) => {
//         if (field && studentId) {
//             const day = parseInt(field.replace('day', ''), 10);
//             setRowData(prevRowData =>
//                 prevRowData.map(record => {
//                     if (record.id === studentId) {
//                         return { ...record, [field]: newValue };
//                     }
//                     return record;
//                 })
//             );

//             if (newValue === false) {
//                 if (canDelete) {
//                     const attendanceId = findAttendanceId(studentId, day);
//                     if (attendanceId) {
//                         deleteAttendance(attendanceId);
//                     } else {
//                         toast.error("Attendance record not found");
//                     }
//                 } else {
//                     toast.error("You are not authorized to delete attendance");
//                 }
//             } else {
//                 updateAttendance(studentId, day, newValue);
//             }
//         }
//     };
    
    
//     const findAttendanceId = (studentId: string, day: number): string | null => {
//         console.log(`Checking for Attendance ID: ${studentId} on Day: ${day}`);
        
//         for (const item of attendanceList) {
//             if (item.attendance) {
//                 const attendanceRecord = item.attendance.find(att => {
//                     const itemDay = moment(att.date).date(); 
//                     console.log("Comparing:", att.studentId, "with Student ID:", studentId, "and Date Day:", itemDay, "with Input Day:", day);
//                     return att.studentId === studentId && itemDay === day;
//                 });
//                 if (attendanceRecord) {
//                     return attendanceRecord.id; 
//                 }
//             }
//         }
        
//         return null; 
//     };
    
    

    
    
//     const deleteAttendance = async (id: string) => {
//         try {
//             const response = await fetch(`/api/attendance/${id}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
    
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(`Error: ${errorData.message || response.statusText}`);
//             }
    
//             const data = await response.json();
//             toast.success(`Attendance deleted for Attendance ID: ${id}`);
            
//             // Update local state to remove the deleted record
//             setRowData(prevRowData => 
//                 prevRowData.filter(record => record.id !== id)
//             );
    
//             console.log("Delete response:", data);
//         } catch (error) {
//             console.error("Error deleting attendance:", error);
//             toast.error("Failed to delete attendance");
//         }
//     };
    
//     return (
//         <div className="ag-theme-quartz" style={{ height: 500 }}>
//             <AgGridReact
//                 rowData={rowData}
//                 columnDefs={colDefs}
//                 domLayout='autoHeight'
//                 onCellValueChanged={(e) => onMarkAttendance(e.colDef.field, e.data.id, e.newValue)}
//             />
//         </div>
//     );
// };

// export default AttendanceGrid;



