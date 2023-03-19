import { TextField } from "@mui/material";
import { TimePickerProps } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { CalendarBlank } from "phosphor-react";
import { useState } from "react";
import { IMeeting } from "../../Agenda";

import "./styles.css";

interface IConfirmScheduleProps {
  schedulingDate: Date;
  returnToCalendarView: () => void;
}

export function ConfirmSchedule({ schedulingDate, returnToCalendarView }: IConfirmScheduleProps) {
  const [scheduleForm, setScheduleForm] = useState<IMeeting>({
    title: "",
    startDate: schedulingDate,
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

    returnToCalendarView();
  }

  return (
    <form className="confirmSchedule-container" onSubmit={scheduleAMeeting}>
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
        <button type="button" onClick={returnToCalendarView}>Cancelar</button>

        <button type="submit">Confirmar</button>
      </div>
    </form>
  );
}