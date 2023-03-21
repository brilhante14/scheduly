import { TextField } from "@mui/material";
import { DateTimeValidationError, TimePickerProps } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { CalendarBlank } from "phosphor-react";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { IMeeting } from "../../../pages/Agenda";

import "./styles.css";
import "../modal-styles.css";

interface IScheduleModalProps {
  meetingsArray: IMeeting[];
  handleCloseModal: () => void;
  editInfo: IMeeting | null;
}

export function ScheduleModal({ editInfo, meetingsArray, handleCloseModal }: IScheduleModalProps) {
  const [dateStartError, setDateStartError] = useState<DateTimeValidationError | null>(null);
  const [dateEndError, setDateEndError] = useState<DateTimeValidationError | null>(null);
  const [scheduleForm, setScheduleForm] = useState<IMeeting>(editInfo ? editInfo : {
    id: uuidv4(),
    title: "",
    startDate: null,
    endDate: null,
  });

  const checkMeetingConflicts = (date: Dayjs) => {
    return meetingsArray.some(meeting => meeting.id !== editInfo?.id && date.isBefore(meeting.endDate) && date.isAfter(meeting.startDate));
  }

  const isBeforeStart = (date: Dayjs) => {
    return date.isBefore(scheduleForm.startDate, "day");
  }

  const isOnSameDayThanStart = (date: Dayjs) => {
    return date.isSame(scheduleForm.startDate, "day") && (
      date.hour() < dayjs(scheduleForm.startDate).get("hour") || (
        date.hour() === dayjs(scheduleForm.startDate).get("hour") && date.minute() < dayjs(scheduleForm.startDate).get("minute")
      )
    );
  }

  const overlappingAnotherAgenda = (date: Dayjs) => {
    return meetingsArray.some(meeting => dayjs(scheduleForm.startDate).isBefore(meeting.startDate) && date.isAfter(meeting.endDate));
  }

  const shouldThrowErrorOnDateStart: TimePickerProps<Dayjs>['shouldDisableTime'] = (
    value,
    view,
  ) => view === "minutes" && checkMeetingConflicts(value);

  const shouldThrowErrorOnDateEnd: TimePickerProps<Dayjs>['shouldDisableTime'] = (
    value,
    view,
  ) => (
    (view === "hours" && isOnSameDayThanStart(value)) ||
    (view === "minutes" && (checkMeetingConflicts(value) || overlappingAnotherAgenda(value)))
  );

  function scheduleAMeeting() {
    if (editInfo) {
      const index = meetingsArray.findIndex(meeting => meeting.id === editInfo.id);
      meetingsArray[index] = scheduleForm;
    }
    else {
      meetingsArray.push(scheduleForm);
    }

    localStorage.setItem("meetings", JSON.stringify(meetingsArray));

    handleCloseModal();
  }

  const errorMessage = (error: DateTimeValidationError) => {
    switch (error) {
      case "shouldDisableDate":
      case "shouldDisableTime-hours": {
        return "Selecione um valor após a data de início.";
      }
      case "shouldDisableTime-minutes": {
        return "Esta data possui um conflito na agenda.";
      }
      case "disablePast": {
        return "Selecione uma data no futuro.";
      }
      case "invalidDate": {
        return "Data inválida.";
      }
      default: {
        return "";
      }
    }
  };

  const isSubmitDisabled = !scheduleForm.title || !!dateEndError || !!dateStartError ||
    !dayjs(scheduleForm.endDate).isValid() || !dayjs(scheduleForm.startDate).isValid();

  return (
    <div className="modal-container">
      <form className="modal-content" onSubmit={scheduleAMeeting}>
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
          shouldDisableDate={isBeforeStart}
          onError={(newError) => setDateEndError(newError)}
          slotProps={{
            textField: {
              helperText: errorMessage(dateEndError),
            },
          }}
        />

        <div className="modal-actions">
          <button type="button" onClick={handleCloseModal}>Cancelar</button>

          <button
            type="submit"
            disabled={isSubmitDisabled}
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
}