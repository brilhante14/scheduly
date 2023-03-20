import { TextField } from "@mui/material";
import { TimePickerProps } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { v4 as uuidv4 } from 'uuid';
import dayjs, { Dayjs } from "dayjs";
import { CalendarBlank } from "phosphor-react";
import { useState } from "react";
import { IMeeting } from "../../pages/Agenda";

import "./styles.css";

interface IScheduleModalProps {
  handleCloseModal: () => void;
}

export function ScheduleModal({ handleCloseModal }: IScheduleModalProps) {
  const [scheduleForm, setScheduleForm] = useState<IMeeting>({
    id: uuidv4(),
    title: "",
    startDate: new Date(),
    endDate: null,
  });

  const disableBeforeStart = (date: Dayjs) => {
    return date.isBefore(scheduleForm.startDate, "day");
  };

  const shouldDisableTime: TimePickerProps<Dayjs>['shouldDisableTime'] = (
    value,
    view,
  ) => (
    value.isSame(scheduleForm.startDate, "day") &&
    ((view === "hours" && value.hour() < dayjs(scheduleForm.startDate).get("hour")) ||
      ((value.hour() === dayjs(scheduleForm.startDate).get("hour")) && value.minute() < dayjs(scheduleForm.startDate).get("minute")))
    // (view === 'minutes' && value.minute() < dayjs(scheduleForm.startDate).get("minute"))
  );

  function scheduleAMeeting() {
    const storage = localStorage.getItem("meetings");
    let storedMeetings = storage ? JSON.parse(storage) : [];
    storedMeetings.push(scheduleForm);

    localStorage.setItem("meetings", JSON.stringify(storedMeetings));

    handleCloseModal();
  }

  return (
    <div className="confirmSchedule-container">
      <form className="confirmSchedule-form" onSubmit={scheduleAMeeting}>
        <div className="confirmSchedule-header">
          <CalendarBlank />
          Marque seu agendamento
        </div>

        <TextField
          label="Título"
          value={scheduleForm.title}
          onChange={(e) => setScheduleForm(prevState => ({ ...prevState, title: e.target.value }))}
        />

        <DateTimePicker
          label="Ínicio"
          ampm={false}
          value={dayjs(scheduleForm.startDate)}
          onChange={(value) => setScheduleForm(prevState => ({ ...prevState, startDate: value?.toDate() || null }))}
          disablePast
        // shouldDisableDate={afterStart}
        // shouldDisableTime={shouldDisableTime}
        />

        <DateTimePicker
          label="Fim"
          ampm={false}
          value={dayjs(scheduleForm.endDate)}
          onChange={(value) => setScheduleForm(prevState => ({ ...prevState, endDate: value?.toDate() || null }))}
          shouldDisableTime={shouldDisableTime}
          shouldDisableDate={disableBeforeStart}
        />

        <div className="confirmSchedule-formActions">
          <button type="button" onClick={handleCloseModal}>Cancelar</button>

          <button type="submit">Confirmar</button>
        </div>
      </form>
    </div>
  );
}