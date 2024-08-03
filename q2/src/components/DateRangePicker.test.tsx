import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DateRangePicker from "./DateRangePicker";

describe("DateRangePicker", () => {
  it("renders the current month and year in Chinese", () => {
    const currentDate = new Date(2024, 7, 3); // August 3, 2024
    vi.setSystemTime(currentDate);

    render(<DateRangePicker />);

    const expectedMonthYear = "2024年8月";
    expect(screen.getByText(expectedMonthYear)).toBeInTheDocument();

    vi.useRealTimers(); // 恢復真實時間
  });

  it("displays weekdays in Chinese", () => {
    render(<DateRangePicker />);
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

    weekdays.forEach((day) => {
      const weekdayElement = screen.getByText(day, { selector: ".weekday" });
      expect(weekdayElement).toBeInTheDocument();
    });
  });

  it("displays days with 日 suffix", () => {
    render(<DateRangePicker />);
    const dayButtons = screen.getAllByRole("button", { name: /\d+日/ });
    expect(dayButtons.length).toBeGreaterThan(0);
  });

  it("allows navigation to previous and next months", () => {
    const currentDate = new Date(2024, 7, 3); // August 3, 2024
    vi.setSystemTime(currentDate);

    render(<DateRangePicker />);
    const prevButton = screen.getByText("<");
    const nextButton = screen.getByText(">");

    expect(screen.getByText("2024年8月")).toBeInTheDocument();

    fireEvent.click(nextButton);
    expect(screen.getByText("2024年9月")).toBeInTheDocument();

    fireEvent.click(prevButton);
    expect(screen.getByText("2024年8月")).toBeInTheDocument();

    fireEvent.click(prevButton);
    expect(screen.getByText("2024年7月")).toBeInTheDocument();

    vi.useRealTimers(); // 恢復真實時間
  });

  it("allows selection of start and end dates", () => {
    const onDateRangeChange = vi.fn();
    render(<DateRangePicker onDateRangeChange={onDateRangeChange} />);

    const dayButtons = screen
      .getAllByRole("button", { name: /\d+日/ })
      .filter((button) => !button.classList.contains("other-month"));

    fireEvent.click(dayButtons[0]);
    fireEvent.click(dayButtons[5]);

    expect(onDateRangeChange).toHaveBeenCalledTimes(2);
  });

  it("displays days from previous and next months", () => {
    render(<DateRangePicker />);
    const otherMonthDays = screen
      .getAllByRole("button", { name: /\d+日/ })
      .filter((button) => button.classList.contains("other-month"));

    expect(otherMonthDays.length).toBeGreaterThan(0);
  });

  it("disables clicks on days from other months", () => {
    render(<DateRangePicker />);
    const otherMonthDays = screen
      .getAllByRole("button", { name: /\d+日/ })
      .filter((button) => button.classList.contains("other-month"));

    otherMonthDays.forEach((day) => {
      expect(day).toBeDisabled();
    });
  });
});
