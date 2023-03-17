import dayjs from "dayjs";
import { PencilSimple, PlusCircle, Trash } from "phosphor-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { sortingByDateAsc, sortingByDateDesc, sortingByTitle } from "../../utils/sorting-methods";

import "./styles.css";

export interface IMeeting {
  title: string;
  start: Date;
  end: Date;
}

export function Agenda() {
  const meetingsStored = [{
    title: "Gym",
    start: new Date("2023-03-18T14:00:00"),
    end: new Date("1995-03-18T15:00:00"),
  }, {
    title: "School",
    start: new Date("2023-03-18T15:00:00"),
    end: new Date("1995-03-18T15:10:00"),
  }];

  const [sortingBy, setSortingBy] = useState<"title" | "dateStart" | "dateEnd">("title");
  const [meetings, setMeetings] = useState<IMeeting[]>(meetingsStored);

  const sortMethods = {
    title: sortingByTitle,
    dateStart: sortingByDateAsc,
    dateEnd: sortingByDateDesc
  }

  function searchMeetings(e: React.ChangeEvent<HTMLInputElement>) {
    setMeetings(meetingsStored.filter(meeting => meeting.title.toLowerCase().includes(e.target.value.toLowerCase())));
  }

  return (
    <div className="agenda-container">
      <Link to="/schedule" className="agenda-scheduleButton">Novo agendamento <PlusCircle /> </Link>

      <input
        className="agenda-searchBar"
        placeholder="Pesquise um agendamento..."
        onChange={searchMeetings}
      />

      <div className="agenda-orderContainer">
        Ordenar por:
        <button onClick={() => setSortingBy("title")}>Título</button>
        <button onClick={() => setSortingBy("dateStart")}>Data de início</button>
        <button onClick={() => setSortingBy("dateEnd")}>Data de fim</button>
      </div>

      <div className="agenda-list">
        {meetings.sort(sortMethods[sortingBy]).map((meeting, index) => {
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