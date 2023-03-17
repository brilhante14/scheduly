import dayjs from "dayjs";
import { PencilSimple, PlusCircle, Trash } from "phosphor-react";
import { useState } from "react";

import "./styles.css";

interface IMeeting {
  title: string;
  start: Date;
  end: Date;
}

export function Agenda() {
  const [meetings, setMeetings] = useState<IMeeting[]>([{
    title: "Gym",
    start: new Date("2023-03-18T14:00:00"),
    end: new Date("1995-03-18T15:00:00"),
  }, {
    title: "School",
    start: new Date("2023-03-18T15:00:00"),
    end: new Date("1995-03-18T15:10:00"),
  },
  ]);

  return (
    <div className="agenda-container">
      <button className="agenda-scheduleButton">Novo agendamento <PlusCircle /> </button>

      <input className="agenda-searchBar" placeholder="Pesquise um agendamento..." />

      <div className="agenda-orderContainer">
        Ordenar por:
        <button>Título</button>
        <button>Data de início</button>
        <button>Data de fim</button>
      </div>

      <div className="agenda-list">
        {meetings.map((meeting, index) => {
          return (
            <div key={index} className="agenda-item">
              {meeting.title}
              <span> {dayjs(meeting.start).format("DD/MM/YY[ - ]HH:mm")} | {dayjs(meeting.end).format("DD/MM/YY[ - ]HH:mm")} </span>
              <div className="agenda-itemButtons">
                <button><PencilSimple /></button>
                <button><Trash /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}