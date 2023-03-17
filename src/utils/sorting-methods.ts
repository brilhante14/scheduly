import dayjs from "dayjs";
import { IMeeting } from "../pages/Agenda";

export function sortingByTitle(a: IMeeting, b: IMeeting) {
  return a.title > b.title ? 1 : -1;
}

export function sortingByDateAsc(a: IMeeting, b: IMeeting) {
  return dayjs(a.start).isAfter(b.start) ? 1 : -1;
}

export function sortingByDateDesc(a: IMeeting, b: IMeeting) {
  return dayjs(a.start).isBefore(b.start) ? 1 : -1;
}
