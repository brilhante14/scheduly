import dayjs from "dayjs";
import { IMeeting } from "../pages/Agenda";

export function sortingByTitle(a: IMeeting, b: IMeeting) {
  return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1;
}

export function sortingByDateAsc(a: IMeeting, b: IMeeting) {
  return dayjs(a.startDate).isAfter(b.startDate) ? 1 : -1;
}

export function sortingByDateDesc(a: IMeeting, b: IMeeting) {
  return dayjs(a.startDate).isBefore(b.startDate) ? 1 : -1;
}
