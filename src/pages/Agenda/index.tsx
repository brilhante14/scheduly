import dayjs from "dayjs";
import { PencilSimple, PlusCircle, Trash } from "phosphor-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sortingByDateAsc, sortingByDateDesc, sortingByTitle } from "../../utils/sorting-methods";

import "./styles.css";

export interface IMeeting {
  id: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
}

export function Agenda() {
  // const meetingsStored = [];
  const storage = localStorage.getItem("meetings");
  const meetingsStored: IMeeting[] = storage ? JSON.parse(storage) : [];

  const [meetings, setMeetings] = useState<IMeeting[]>(meetingsStored);
  const [sortingBy, setSortingBy] = useState<"title" | "dateStart" | "dateEnd">("title");

  const sortMethods = {
    title: sortingByTitle,
    dateStart: sortingByDateAsc,
    dateEnd: sortingByDateDesc
  }

  function searchMeetings(e: React.ChangeEvent<HTMLInputElement>) {
    setMeetings(meetingsStored.filter(meeting => meeting.title.toLowerCase().includes(e.target.value.toLowerCase())));
  }

  function removeAMeeting(id: string) {
    const storage = localStorage.getItem("meetings");
    let storedMeetings = storage ? JSON.parse(storage) : [];

    storedMeetings = storedMeetings.filter((meeting: IMeeting) => meeting.id !== id);

    setMeetings(storedMeetings);
    localStorage.setItem("meetings", JSON.stringify(storedMeetings));
  }

  return (
    <div className="agenda-container">
      <Link
        to="/schedule"
        className="agenda-scheduleButton"
      >
        Novo agendamento&nbsp;
        <PlusCircle />
      </Link>

      <input
        className="agenda-searchBar"
        placeholder="Pesquise um agendamento..."
        onChange={searchMeetings}
      />

      <div className="agenda-orderContainer">
        Ordenar por:
        <button
          className={sortingBy === "title" ? "selected" : ""}
          onClick={() => setSortingBy("title")}
        >
          Título
        </button>
        <button
          className={sortingBy === "dateStart" ? "selected" : ""}
          onClick={() => setSortingBy("dateStart")}
        >
          Data de início
        </button>
        <button
          className={sortingBy === "dateEnd" ? "selected" : ""}
          onClick={() => setSortingBy("dateEnd")}
        >
          Data de fim
        </button>
      </div>

      <div className="agenda-list">
        {meetings.sort(sortMethods[sortingBy]).map(meeting => {
          return (
            <div key={meeting.id} className="agenda-item">
              {meeting.title}
              <span> {dayjs(meeting.startDate).format("DD/MM/YY[ - ]HH:mm")} | {dayjs(meeting.endDate).format("DD/MM/YY[ - ]HH:mm")} </span>
              <div className="agenda-itemButtons">
                <button><PencilSimple /></button>
                <button onClick={() => removeAMeeting(meeting.id)}><Trash /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}