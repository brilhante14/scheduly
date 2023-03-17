import { useState } from "react";
import { Calendar } from "../../components/Calendar";
import { TimePicker } from "../../components/TimePicker";
import { ConfirmSchedule } from "./ConfirmSchedule";

import "./styles.css";

export function Schedule() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const isDateSelected = true;

  return (
    <div className='schedule-container'>
      {selectedDate ?
        <ConfirmSchedule schedulingDate={new Date()} returnToCalendarView={() => { }} />
        :
        (
          <>
            <Calendar />
            <TimePicker />
          </>
        )
      }
    </div>
  );
}