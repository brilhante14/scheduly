import { TextField } from "@mui/material";
import { TimePickerProps } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { CalendarBlank } from "phosphor-react";
import { useState } from "react";

import "./styles.css";

interface IConfirmScheduleProps {
  schedulingDate: Date;
  returnToCalendarView: () => void;
}

export function ConfirmSchedule({ schedulingDate, returnToCalendarView }: IConfirmScheduleProps) {
  const [startDate, setStartDate] = useState<Date | null>(schedulingDate);

  const disableBeforeStart = (date: Dayjs) => {
    return date.isBefore(startDate, "day");
  };

  const shouldDisableTime: TimePickerProps<Dayjs>['shouldDisableTime'] = (
    value,
    view,
  ) => (
    (view === "hours" && value.hour() < dayjs(startDate).get("hour")) ||
    (view === 'minutes' && value.minute() < dayjs(startDate).get("minute"))
  );

  return (
    <form className="confirmSchedule-container" onSubmit={() => { }}>
      <div className="confirmSchedule-header">
        <CalendarBlank />
        Marque seu agendamento
      </div>

      <TextField label="Título" />
      <DateTimePicker
        label="Ínicio"
        ampm={false}
        value={dayjs(startDate)}
        onChange={(value) => setStartDate(value?.toDate() || null)}
        disablePast
      // shouldDisableDate={afterStart}
      // shouldDisableTime={shouldDisableTime}
      />

      <DateTimePicker
        label="Fim"
        ampm={false}
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