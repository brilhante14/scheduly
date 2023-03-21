import dayjs from "dayjs";
import { ArrowDown, ArrowUp, PencilSimple, PlusCircle, Trash } from "phosphor-react";
import { useState } from "react";
import { ScheduleModal } from "../../components/ScheduleModal";
import { sortingByDateAsc, sortingByDateDesc, sortingByTitleAsc, sortingByTitleDesc } from "../../utils/sorting-methods";

import "./styles.css";

export interface IMeeting {
  id: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface ISorting {
  sortBy: "title" | "date";
  sortOrder: "ASC" | "DESC";
}

export function Agenda() {
  const [meetings, setMeetings] = useState<IMeeting[]>(() => {
    const storage = localStorage.getItem("meetings");
    const meetingsStored: IMeeting[] = storage ? JSON.parse(storage) : [];

    return meetingsStored;
  });
  const [meetingToEdit, setMeetingToEdit] = useState<IMeeting | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sorting, setSorting] = useState<ISorting>({ sortBy: "title", sortOrder: "ASC" });
  const [search, setSearch] = useState("");

  const sortMethods = {
    title: sorting.sortOrder === "ASC" ? sortingByTitleAsc : sortingByTitleDesc,
    date: sorting.sortOrder === "ASC" ? sortingByDateAsc : sortingByDateDesc,
  }

  function removeAMeeting(id: string) {
    const meetingsFiltered = meetings.filter((meeting: IMeeting) => meeting.id !== id);

    setMeetings(meetingsFiltered);
    localStorage.setItem("meetings", JSON.stringify(meetingsFiltered));
  }

  function openEditModal(meeting: IMeeting) {
    setMeetingToEdit(meeting);

    setIsModalOpen(true);
  }

  function sortMeetings(sortBy: "title" | "date") {
    setSorting(prevState => (
      { sortBy, sortOrder: prevState.sortOrder === "ASC" ? "DESC" : "ASC" }
    ))
  }

  function ordenationArrow() {
    return sorting.sortOrder === "ASC" ?
      <ArrowUp />
      :
      <ArrowDown />
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
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="agenda-orderContainer">
        Ordenar por:
        <button
          className={sorting.sortBy === "title" ? "selected" : ""}
          onClick={() => sortMeetings("title")}
        >
          Título&nbsp;
          {
            sorting.sortBy === "title" && ordenationArrow()
          }
        </button>
        <button
          className={sorting.sortBy === "date" ? "selected" : ""}
          onClick={() => sortMeetings("date")}
        >
          Data&nbsp;
          {
            sorting.sortBy === "date" && ordenationArrow()
          }
        </button>
      </div>

      <div className="agenda-list">
        {meetings
          .sort(sortMethods[sorting.sortBy])
          .filter(meeting => meeting.title.toLowerCase().includes(search.toLowerCase()))
          .map(meeting => {
            return (
              <div key={meeting.id} className="agenda-item">
                <span title={meeting.title}>
                  {meeting.title}
                </span>
                <span> {dayjs(meeting.startDate).format("DD/MM/YY[ - ]HH:mm")} | {dayjs(meeting.endDate).format("DD/MM/YY[ - ]HH:mm")} </span>
                <div className="agenda-itemButtons">
                  <button onClick={() => openEditModal(meeting)}><PencilSimple /></button>
                  <button onClick={() => removeAMeeting(meeting.id)}><Trash /></button>
                </div>
              </div>
            );
          })}
      </div>

      {isModalOpen && (
        <ScheduleModal
          editInfo={meetingToEdit}
          meetingsArray={meetings}
          handleCloseModal={() => {
            setMeetingToEdit(null);
            setIsModalOpen(false);
          }}
        />
      )}
    </main>
  );
}