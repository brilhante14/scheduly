import dayjs from "dayjs";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useMemo, useState } from "react";
import { getWeekDays } from "../../utils/get-week-days";
import "./styles.css"

interface ICalendarWeek {
  week: number;
  days: {
    date: dayjs.Dayjs;
    disabled: boolean;
  }[]
}

type CalendarWeeks = ICalendarWeek[];

export function Calendar() {

  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1);
  });

  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");

  const shortWeekDays = getWeekDays({ short: true });

  function handlePreviousMonth() {
    setCurrentDate(date => date.subtract(1, "month"));
  }

  function handleNextMonth() {
    setCurrentDate(date => date.add(1, "month"));
  }

  const calendarWeeks = useMemo(() => {
    const currentMonthArray = Array.from({ length: currentDate.daysInMonth() }).map((_, i) => {
      return currentDate.set("date", i + 1);
    });

    const weekIndexOfFirstDay = currentDate.get("day");
    const previousMonthArray = Array.from({ length: weekIndexOfFirstDay })
      .map((_, i) => {
        return currentDate.subtract(i + 1, "day");
      })
      .reverse();

    const lastDayInCurrentMonth = currentDate.set("date", currentDate.daysInMonth());
    const weekIndexOfLastDay = lastDayInCurrentMonth.get("date");
    const nextMonthArray = Array.from({ length: 7 - (weekIndexOfLastDay + 1) })
      .map((_, i) => {
        return lastDayInCurrentMonth.add(i + 1, "day");
      })

    const calendarDays = [
      ...previousMonthArray.map(date => ({ date, disabled: true })),
      ...currentMonthArray.map(date => ({
        date,
        disabled:
          date.endOf("day").isBefore(new Date())
        // Inserir datas agendadas
      })),
      ...nextMonthArray.map(date => ({ date, disabled: true })),
    ];

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>((week, _, i, original) => {
      const isNewWeek = i % 7 === 0;

      if (isNewWeek) {
        week.push({
          week: i / 7 + 1,
          days: original.slice(i, i + 7),
        });
      }

      return week;
    }, []);

    return calendarWeeks;
  }, [currentDate]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <p className="calendar-title">{currentMonth} <span>{currentYear}</span></p>

        <div className="calendar-actions">
          <button onClick={handlePreviousMonth} title="Mês anterior">
            <CaretLeft />
          </button>

          <button onClick={handleNextMonth} title="Mês seguinte">
            <CaretRight />
          </button>
        </div>
      </div>

      <table className="calendar-body">
        <thead>
          <tr>
            {shortWeekDays.map(weekDay => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td key={date.toString()}>
                  <button
                    className="calendar-day"
                    onClick={() => { }}
                    disabled={disabled}
                  >
                    {date.get("date")}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}