import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import DateRangePicker from "./DateRangePicker";

describe("DateRangePicker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2023, 7, 15)); // 設置為 2023 年 8 月 15 日
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the current month and year", () => {
    render(<DateRangePicker />);
    expect(screen.getByText("August 2023")).toBeInTheDocument();
  });

  it("renders day names", () => {
    render(<DateRangePicker />);
    const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
    dayNames.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it("renders days of the current month", () => {
    render(<DateRangePicker />);
    const calendar = screen.getByRole("group", { name: /calendar/i });

    // 檢查當前月份的天數
    for (let day = 1; day <= 31; day++) {
      const dayButtons = within(calendar).queryAllByText(`${day}日`);
      const currentMonthDay = dayButtons.find(
        (button) => !(button as HTMLButtonElement).disabled
      );
      expect(currentMonthDay).toBeInTheDocument();
    }
  });

  it("renders days from previous and next months", () => {
    render(<DateRangePicker />);
    const calendar = screen.getByRole("group", { name: /calendar/i });

    // 檢查上個月的天數
    const prevMonthDays = within(calendar).queryAllByText(/(30|31)日/);
    expect(prevMonthDays[0]).toBeDisabled();

    // 檢查下個月的天數
    const nextMonthDays = within(calendar).queryAllByText(/[1-9]日/);
    expect(nextMonthDays[nextMonthDays.length - 1]).toBeDisabled();
  });

  it("highlights today", () => {
    render(<DateRangePicker />);
    expect(screen.getByText("15日").closest("button")).toHaveClass("today");
  });

  it("selects start and end dates when clicking on days", () => {
    render(<DateRangePicker />);

    fireEvent.click(screen.getByText("10日"));
    expect(screen.getByText("10日").closest("button")).toHaveClass("start");

    fireEvent.click(screen.getByText("20日"));
    expect(screen.getByText("10日").closest("button")).toHaveClass("start");
    expect(screen.getByText("20日").closest("button")).toHaveClass("end");

    // 檢查範圍內的日期
    for (let day = 11; day < 20; day++) {
      expect(screen.getByText(`${day}日`).closest("button")).toHaveClass(
        "in-range"
      );
    }
  });

  it("resets selection when clicking on start date again", () => {
    render(<DateRangePicker />);

    fireEvent.click(screen.getByText("10日"));
    expect(screen.getByText("10日").closest("button")).toHaveClass("start");

    fireEvent.click(screen.getByText("10日"));
    expect(screen.getByText("10日").closest("button")).not.toHaveClass("start");
  });

  it("does not allow selection of days from other months", () => {
    render(<DateRangePicker />);

    const previousMonthDay = screen.getAllByText("30日")[0];
    const nextMonthDay = screen.getAllByText("1日")[1];

    expect(previousMonthDay).toBeDisabled();
    expect(nextMonthDay).toBeDisabled();

    fireEvent.click(previousMonthDay);
    fireEvent.click(nextMonthDay);

    expect(previousMonthDay.closest("button")).not.toHaveClass("start");
    expect(nextMonthDay.closest("button")).not.toHaveClass("start");
  });
});
