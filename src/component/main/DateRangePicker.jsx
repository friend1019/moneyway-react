import React, { useState } from 'react';
import '../../css/main/DateRangePicker.css'; 

const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
};

const DateRangePicker = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 6)); 
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [hoveredDate, setHoveredDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const changeMonth = (amount) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + amount);
        setCurrentDate(newDate);
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(year, month, day);

        if (!startDate || (startDate && endDate)) {
            setStartDate(clickedDate);
            setEndDate(null);
        } else if (clickedDate < startDate) {
            setStartDate(clickedDate);
        } else {
            setEndDate(clickedDate);
        }
    };

    const renderCalendar = () => {
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = firstDayOfMonth; i > 0; i--) {
            days.push({ day: prevMonthDays - i + 1, isCurrentMonth: false });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, isCurrentMonth: true });
        }

        return days.map((d, index) => {
            if (!d.isCurrentMonth) {
                return <div key={`prev-${index}`} className="date other-month">{d.day}</div>;
            }
            
            const dayDate = new Date(year, month, d.day);
            let className = "date";

            if (startDate && endDate) {
                if (dayDate > startDate && dayDate < endDate) className += " in-range";
                if (dayDate.getTime() === startDate.getTime()) className += " start-date";
                if (dayDate.getTime() === endDate.getTime()) className += " end-date";
            } else if (startDate) {
                if (dayDate.getTime() === startDate.getTime()) className += " start-date";
                if (hoveredDate && dayDate > startDate && dayDate <= hoveredDate) {
                    className += " in-range";
                }
            }
            
            return (
                <div 
                    key={d.day} 
                    className={className} 
                    onClick={() => handleDateClick(d.day)}
                    onMouseEnter={() => d.isCurrentMonth && setHoveredDate(dayDate)}
                    onMouseLeave={() => setHoveredDate(null)}
                >
                    {d.day}
                </div>
            );
        });
    };

    return (
        <div className="container">
            <div className="calendar-wrapper">
                <div className="calendar-header">
                    <span className="nav" onClick={() => changeMonth(-1)}>&lt;</span>
                    <strong>{year}년 {month + 1}월</strong>
                    <span className="nav" onClick={() => changeMonth(1)}>&gt;</span>
                </div>
                <div className="day-names">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="calendar-grid">
                    {renderCalendar()}
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;