import dayjs from "dayjs";
import { useState } from "react";

import "./styles.css"

export function TimePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null;
  const describeDate = selectedDate ? dayjs(selectedDate).format("DD[ de ]MMMM") : null;

  return (
    <div className="timePicker-container">
      <p className="timePicker-header">
        Segunda-feira <span> 03 de abril</span>
      </p>
      <div className="timePicker-list">
        {[8, 9, 10, 11, 12, 13, 8, 9, 10, 11, 12, 13].map(hour => (
          <button
            className="timePicker-item"
            key={hour}
          >
            {String(hour).padStart(2, "0")}:00h
          </button>
        ))}
      </div>
    </div>
  );
}