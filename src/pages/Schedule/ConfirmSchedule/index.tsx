import dayjs from "dayjs";
import { CalendarBlank, Clock } from "phosphor-react";

import "./styles.css";

interface IConfirmScheduleProps {
  schedulingDate: Date;
  returnToCalendarView: () => void;
}

export function ConfirmSchedule({ schedulingDate, returnToCalendarView }: IConfirmScheduleProps) {
  const describredDate = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ]YYYY");
  const describedTime = dayjs(schedulingDate).format("HH:mm[h]");

  return (
    <form className="confirmSchedule-container" onSubmit={() => { }}>
      <div className="confirmSchedule-header">
        <p>
          <CalendarBlank />
          {describredDate}
        </p>
        <p>
          <Clock />
          {describedTime}
        </p>
      </div>

      <label>
        <p>Título</p>
        <input placeholder="Seu nome" />
      </label>

      <label>
        <p>Ínicio</p>
        <input type="datetime-local" />

      </label>

      <label>
        <p>Fim</p>
        <input type="datetime-local" />
      </label>

      <div className="confirmSchedule-formActions">
        <button type="button" onClick={returnToCalendarView}>Cancelar</button>
        <button type="submit">
          Confirmar
        </button>
      </div>
    </form>
  );
}