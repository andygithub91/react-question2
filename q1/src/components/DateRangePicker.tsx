import React, { useState } from "react";
import "./DateRangePicker.css";

interface DateRangePickerProps {}

const DateRangePicker: React.FC<DateRangePickerProps> = () => {
  const [currentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const dayOfWeek = firstDay.getDay();
    return { daysInMonth, dayOfWeek, firstDay, lastDay };
  };

  const handleDateClick = (date: Date) => {
    if (date.getMonth() !== currentDate.getMonth()) return; // 不允許選擇非當前月份的日期

    if (!startDate || date < startDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (date > startDate) {
      setEndDate(date);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, dayOfWeek, firstDay, lastDay } =
      getDaysInMonth(currentDate);
    const days: JSX.Element[] = [];

    // 添加上個月的日期
    const prevMonthDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - i - 1);
      days.push(
        <button
          key={`prev-${prevMonthDays - i}`}
          className="day other-month"
          disabled
        >
          {prevMonthDays - i}日
        </button>
      );
    }

    // 添加當前月份的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isToday = date.toDateString() === new Date().toDateString();
      const isStart = startDate && date.getTime() === startDate.getTime();
      const isEnd = endDate && date.getTime() === endDate.getTime();
      const isInRange =
        startDate && endDate && date >= startDate && date <= endDate;

      let className = "day";
      if (isToday) className += " today";
      if (isStart) className += " start";
      if (isEnd) className += " end";
      if (isInRange) className += " in-range";

      days.push(
        <button
          key={day}
          className={className}
          onClick={() => handleDateClick(date)}
        >
          {day}日
        </button>
      );
    }

    // 添加下個月的日期
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 行 * 7 列 = 42
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(lastDay);
      date.setDate(date.getDate() + i);
      days.push(
        <button key={`next-${i}`} className="day other-month" disabled>
          {i}日
        </button>
      );
    }

    return days;
  };

  return (
    <div className="date-range-picker">
      <div className="header">
        <span>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="calendar" role="group" aria-label="calendar">
        {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
          <div key={day} className="day-name">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

export default DateRangePicker;
