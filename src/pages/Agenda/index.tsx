import dayjs from "dayjs";
import { PencilSimple, PlusCircle, Trash } from "phosphor-react";
import { useEffect, useState } from "react";
import { ScheduleModal } from "../../components/ScheduleModal";
import { sortingByDateAsc, sortingByDateDesc, sortingByTitle } from "../../utils/sorting-methods";

import "./styles.css";

export interface IMeeting {
  id: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
}

export function Agenda() {
  const storage = localStorage.getItem("meetings");

  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortingBy, setSortingBy] = useState<"title" | "dateStart" | "dateEnd">("title");
  const [search, setSearch] = useState("");

  const sortMethods = {
    title: sortingByTitle,
    dateStart: sortingByDateAsc,
    dateEnd: sortingByDateDesc
  }

  useEffect(() => {
    const meetingsStored: IMeeting[] = storage ? JSON.parse(storage) : [];

    setMeetings(meetingsStored);
  }, [storage]);

  function searchMeetings(e: React.ChangeEvent<HTMLInputElement>) {
    // setMeetings(meetingsStored;
    setSearch(e.target.value);
  }

  function removeAMeeting(id: string) {
    const storage = localStorage.getItem("meetings");
    let storedMeetings = storage ? JSON.parse(storage) : [];

    storedMeetings = storedMeetings.filter((meeting: IMeeting) => meeting.id !== id);

    setMeetings(storedMeetings);
    localStorage.setItem("meetings", JSON.stringify(storedMeetings));
  }

  return (
    <main className="agenda-container">
      <button
        onClick={() => setIsModalOpen(true)}
        className="agenda-scheduleButton"
      >
        Novo agendamento&nbsp;
        <PlusCircle />
      </button>

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
        {meetings
          .sort(sortMethods[sortingBy])
          .filter(meeting => meeting.title.toLowerCase().includes(search.toLowerCase()))
          .map(meeting => {
            return (
              <div key={meeting.id} className="agenda-item">
                <span title={meeting.title}>
                  {meeting.title}
                </span>
                <span> {dayjs(meeting.startDate).format("DD/MM/YY[ - ]HH:mm")} | {dayjs(meeting.endDate).format("DD/MM/YY[ - ]HH:mm")} </span>
                <div className="agenda-itemButtons">
                  <button><PencilSimple /></button>
                  <button onClick={() => removeAMeeting(meeting.id)}><Trash /></button>
                </div>
              </div>
            );
          })}
      </div>

      {isModalOpen && (<ScheduleModal meetingsArray={meetings} handleCloseModal={() => setIsModalOpen(false)} />)}
    </main>
  );
}