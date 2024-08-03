import React, { useState } from "react";
import "./DateRangePicker.css";

interface DateRangePickerProps {
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeChange,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const lastDayOfPrevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate();

  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;

    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (!startDate || (startDate && clickedDate < startDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (clickedDate >= startDate) {
      setEndDate(clickedDate);
    }

    if (onDateRangeChange) {
      onDateRangeChange(startDate, endDate);
    }
  };

  const isToday = (day: number, isCurrentMonth: boolean): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear() &&
      isCurrentMonth
    );
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + delta,
      1
    );
    setCurrentDate(newDate);
  };

  const renderDays = () => {
    const days = [];
    const totalDays = 42; // 6 rows * 7 days

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = lastDayOfPrevMonth - i;
      days.push(
        <button
          key={`prev-${day}`}
          className="day other-month"
          onClick={() => handleDateClick(day, false)}
          disabled
        >
          {day}日
        </button>
      );
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      const isStart = startDate && date.getTime() === startDate.getTime();
      const isEnd = endDate && date.getTime() === endDate.getTime();
      const isSelected =
        startDate && endDate && date >= startDate && date <= endDate;

      days.push(
        <button
          key={`current-${i}`}
          className={`day ${isToday(i, true) ? "today" : ""} ${
            isStart || isEnd ? "active" : ""
          } ${isSelected ? "selected" : ""}`}
          onClick={() => handleDateClick(i, true)}
        >
          {i}日
        </button>
      );
    }

    // Next month days
    const remainingDays = totalDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <button
          key={`next-${i}`}
          className="day other-month"
          onClick={() => handleDateClick(i, false)}
          disabled
        >
          {i}日
        </button>
      );
    }

    return days;
  };

  const formatMonthYear = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 獲取月份（1-12）
    return `${year}年${month}月`;
  };

  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="date-range-picker">
      <div className="header">
        <button className="month-nav" onClick={() => changeMonth(-1)}>
          &lt;
        </button>
        <span>{formatMonthYear(currentDate)}</span>
        <button className="month-nav" onClick={() => changeMonth(1)}>
          &gt;
        </button>
      </div>
      <div className="calendar">
        {weekdays.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default DateRangePicker;
