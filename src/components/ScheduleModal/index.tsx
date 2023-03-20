import { TextField } from "@mui/material";
import { DateTimeValidationError, TimePickerProps } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { v4 as uuidv4 } from 'uuid';
import dayjs, { Dayjs } from "dayjs";
import { CalendarBlank } from "phosphor-react";
import { useMemo, useState } from "react";
import { IMeeting } from "../../pages/Agenda";

import "./styles.css";

interface IScheduleModalProps {
  meetingsArray: IMeeting[];
  handleCloseModal: () => void;
}

export function ScheduleModal({ meetingsArray, handleCloseModal }: IScheduleModalProps) {
  const [dateStartError, setDateStartError] = useState<DateTimeValidationError | null>(null);
  const [dateEndError, setDateEndError] = useState<DateTimeValidationError | null>(null);
  const [scheduleForm, setScheduleForm] = useState<IMeeting>({
    id: uuidv4(),
    title: "",
    startDate: new Date(),
    endDate: null,
  });

  const checkMeetingConflicts = (date: Dayjs) => {
    return meetingsArray.some(meeting => date.isBefore(meeting.endDate) && date.isAfter(meeting.startDate));
  }

  const isAtLeastADayBeforeStart = (date: Dayjs) => {
    return date.isBefore(scheduleForm.startDate, "day");
  }

  const isOnSameDayThanStart = (date: Dayjs) => {
    return date.isSame(scheduleForm.startDate, "day") && (
      date.hour() < dayjs(scheduleForm.startDate).get("hour") || (
        date.hour() === dayjs(scheduleForm.startDate).get("hour") && date.minute() < dayjs(scheduleForm.startDate).get("minute")
      )
    );
  }

  const shouldThrowErrorOnDateStart: TimePickerProps<Dayjs>['shouldDisableTime'] = (
    value,
    view,
  ) => (
    view === "minutes" && checkMeetingConflicts(value)
  );

  const shouldThrowErrorOnDateEnd: TimePickerProps<Dayjs>['shouldDisableTime'] = (
    value,
    view,
  ) => (
    isAtLeastADayBeforeStart(value) ||
    (view === "hours" && isOnSameDayThanStart(value)) || (view === "minutes" && checkMeetingConflicts(value))
  );

  function scheduleAMeeting() {
    const storage = localStorage.getItem("meetings");
    let storedMeetings = storage ? JSON.parse(storage) : [];
    storedMeetings.push(scheduleForm);

    localStorage.setItem("meetings", JSON.stringify(storedMeetings));

    handleCloseModal();
  }

  const errorMessage = (error: DateTimeValidationError) => {
    switch (error) {
      case 'shouldDisableTime-hours': {
        return 'Selecione um valor após a data de início.';
      }
      case 'shouldDisableTime-minutes': {
        return 'Esta data possui um conflito na agenda.';
      }
      case 'disablePast': {
        return 'Selecione uma data no futuro.';
      }
      default: {
        return '';
      }
    }
  };

  return (
    <div className="confirmSchedule-container">
      <form className="confirmSchedule-form" onSubmit={scheduleAMeeting}>
        <div className="confirmSchedule-header">
          <CalendarBlank />
          Preencha todos os campos
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
          shouldDisableTime={shouldThrowErrorOnDateStart}
          onError={(newError) => setDateStartError(newError)}
          slotProps={{
            textField: {
              helperText: errorMessage(dateStartError),
            },
          }}
        />

        <DateTimePicker
          label="Fim"
          ampm={false}
          value={dayjs(scheduleForm.endDate)}
          onChange={(value) => setScheduleForm(prevState => ({ ...prevState, endDate: value?.toDate() || null }))}
          shouldDisableTime={shouldThrowErrorOnDateEnd}
          onError={(newError) => setDateEndError(newError)}
          slotProps={{
            textField: {
              helperText: errorMessage(dateEndError),
            },
          }}
        />

        <div className="confirmSchedule-formActions">
          <button type="button" onClick={handleCloseModal}>Cancelar</button>

          <button
            type="submit"
            disabled={!scheduleForm.title || !!dateEndError || !!dateStartError}
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
}