"use client"

// import moment from "moment/moment";
// import { addMonths } from "date-fns";

// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";

// import { CalendarDays } from "lucide-react";
// import { useState } from "react";

// interface MonthSelectionProps {
//   selectedMonth: Date;
//   onMonthChange: (date: Date) => void;
// }

// const MonthSelection = ({ selectedMonth, onMonthChange }: MonthSelectionProps) => {

//     const today = new Date()

//   const [month, setMonth] = useState(selectedMonth || addMonths(new Date(), 0));

//   return (
//     <div>
//       <Popover>
//         <PopoverTrigger>
//           <Button
//             variant="outline"
//             className="flex gap-2 items-center text-slate-500"
//           >
//             <CalendarDays className="h-5 w-5" />
//             {moment(month).format("MMM yy")}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent>
//           <Calendar
//             mode="single"
//             month={month}
//             onMonthChange={(value) => {
//               setMonth(value);
//               onMonthChange(value);
//             }}
//             className="flex flex-1 justify-center"
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// };

// export default MonthSelection;


import { useState } from "react";
import { addMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import moment from "moment/moment";

interface MonthSelectionProps {
    onMonthChange: (date: Date) => void;
}

const MonthSelection = ({ onMonthChange }: MonthSelectionProps) => {
    const [month, setMonth] = useState(addMonths(new Date(), 0));

    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <div className="flex gap-2 items-center">
                        <Button variant="outline" className="flex gap-2 items-center text-slate-500">
                            <CalendarDays className="h-5 w-5" />
                            {moment(month).format("MMM yy")}
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent align="start" side="bottom">
                    <Calendar
                        mode="single"
                        month={month}
                        onMonthChange={(value) => {
                            setMonth(value);
                            onMonthChange(value);
                        }}
                        className="flex flex-1 justify-center"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default MonthSelection;


