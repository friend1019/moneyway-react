import React, { useState, useEffect } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import '../../css/myplan/Schedule.css';

import hotelIcon from "../../images/shopping/hotel.svg";
import cafeIcon from "../../images/shopping/cafe.svg";
import activityIcon from "../../images/shopping/activity.svg";
import foodIcon from "../../images/shopping/food.svg";
import shoppingIcon from "../../images/shopping/shopping.svg";
import tourIcon from "../../images/shopping/tour.svg";
import plusArrow from '../../images/myplan/plus-arrow.svg';

const CATEGORY_ORDER = [
  { name: "숙소", icon: hotelIcon },
  { name: "식당", icon: foodIcon },
  { name: "관광명소", icon: tourIcon },
  { name: "액티비티/체험", icon: activityIcon },
  { name: "카페", icon: cafeIcon },
  { name: "쇼핑", icon: shoppingIcon },
];

function DroppablePlannerCell({ day, time }) {
  const { setNodeRef, isOver } = useDroppable({ id: `${day}-${time}` });
  return (
    <div
      ref={setNodeRef}
      style={{ backgroundColor: isOver ? '#e0f7ff' : undefined }}
      className='grid-cell planner-cell'
    />
  );
}

const getCategoryIcon = (categoryName) => {
  const category = CATEGORY_ORDER.find(c => c.name === categoryName);
  return category ? <img src={category.icon} alt={categoryName} className="item-icon" /> : null;
};

const toCssCategory = (category) => category ? category.replace(/[ /]/g, '-') : '';

const ScheduleItem = ({
  item, day, slotHeight, isEditMode, onItemDeleted, onItemUpdated, onContextMenu
}) => {
  const [isHover, setIsHover] = useState(false);
  const [dragType, setDragType] = useState(null); // 'top' | 'bottom' | null
  const [startY, setStartY] = useState(null);
  const [startDuration, setStartDuration] = useState(null);

  const uniqueId = item.id || item.cartId || item.placeId;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: uniqueId,
    data: { ...item, origin: 'schedule', originalDay: day },
    disabled: !isEditMode,
  });

  function getTimeTop(time) {
    const [h, m] = time.split(':').map(Number);
    return ((h - 8) + (m >= 30 ? 0.5 : 0)) * 10; // 1칸=10rem, 0.5칸=5rem
  }

  // 카드 위치 및 크기
  const style = {
    top: `${getTimeTop(item.time)}rem`,
    height: `${item.duration * slotHeight}px`,
    left: 0,
    right: 0,
    margin: 0,
    position: 'absolute',
    zIndex: transform ? 999 : 'auto',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: isDragging ? 'none' : 'box-shadow 0.1s'
  };

  const dragAreaStyle = {
    width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,
    zIndex: 2, cursor: isEditMode ? 'grab' : 'default', background: 'none'
  };

  // 여기서 confirm/alert 제거, onContextMenu만 호출
  const handleContextMenu = (e) => {
    if (!isEditMode) return;
    if (onContextMenu) onContextMenu(e, item, day);
  };

  const handleDragStart = (e, type) => {
    e.preventDefault(); e.stopPropagation();
    setDragType(type);
    setStartY(e.clientY);
    setStartDuration(item.duration);
    document.body.style.cursor = "ns-resize";
  };

  useEffect(() => {
    if (!dragType) return;
    const handleMove = (e) => {
      if (startY === null) return;
      const deltaY = e.clientY - startY;
      const slotHalf = slotHeight / 2;
      let offsetHalf = Math.round(deltaY / slotHalf) * 0.5;
      let newDuration = dragType === "top"
        ? startDuration - offsetHalf
        : startDuration + offsetHalf;
      newDuration = Math.max(0.5, Math.round(newDuration * 2) / 2);
      if (newDuration !== item.duration) {
        if (onItemUpdated) onItemUpdated({ ...item, duration: newDuration }, day);
      }
    };
    const handleUp = () => {
      setDragType(null);
      setStartY(null);
      setStartDuration(null);
      document.body.style.cursor = "";
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragType, startY, startDuration, item, day, onItemUpdated, slotHeight]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`schedule-item schedule-item-card ${toCssCategory(item.category)}`}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {isEditMode && isHover && (
        <>
          <button
            className="resize-btn top"
            style={{
              position: 'absolute', top: '-14px', left: '50%',
              transform: 'translate(-50%, 0) rotate(180deg)', zIndex: 20
            }}
            tabIndex={-1}
            onMouseDown={e => handleDragStart(e, "top")}
          >
            <img src={plusArrow} alt="minus" style={{ width: 22 }} />
          </button>
          <button
            className="resize-btn bottom"
            style={{
              position: 'absolute', bottom: '-14px', left: '50%',
              transform: 'translate(-50%, 0)', zIndex: 20
            }}
            tabIndex={-1}
            onMouseDown={e => handleDragStart(e, "bottom")}
          >
            <img src={plusArrow} alt="plus" style={{ width: 22 }} />
          </button>
        </>
      )}
      <div
        className="item-content"
        {...(isEditMode ? listeners : {})}
        style={dragAreaStyle}
      >
        <div className="item-category-info">
          {getCategoryIcon(item.category)}
          <span className="item-category-name">{item.category}</span>
        </div>
        <div className="item-name">{item.placeName || item.name}</div>
        <div className="item-cost">₩ {item.cost ? item.cost.toLocaleString() : (item.price ? item.price.toLocaleString() : 0)}</div>
      </div>
    </div>
  );
};


const Schedule = ({
  planDetails,
  dailySchedules,
  timeSlots,
  onContextMenu,
  slotHeight,
  isEditingBudget,
  onBudgetClick,
  onBudgetChange,
  onBudgetBlur,
  onBudgetKeyDown,
  budgetInput,
  isEditMode,
  isEditingTitle,
  titleInput,
  onTitleClick,
  onTitleChange,
  onTitleBlur,
  onTitleKeyDown,
  planDurationStr,
  onDurationDrag,
  ...props
}) => {
  const [schedules, setSchedules] = useState(dailySchedules);

  // 상위에서 dailySchedules이 바뀌면 동기화
  useEffect(() => { setSchedules(dailySchedules); }, [dailySchedules]);

  // 일정 삭제 콜백
  const handleItemDeleted = (item, day) => {
    setSchedules(prev => ({
      ...prev,
      [day]: prev[day].filter(d => d.id !== item.id)
    }));
  };

  // 일정 수정 콜백(duration)
  const handleItemUpdated = (updatedItem, day) => {
    setSchedules(prev => ({
      ...prev,
      [day]: prev[day].map(d => d.id === updatedItem.id ? updatedItem : d)
    }));
  };

  const days = Object.keys(schedules || {});

  return (
    <>
      {/* 플랜 info 카드(제목, 예산, 기간 등) */}
      <div className='plan-info-card'>
        <div className='plan-details-left'>
          <img src="https://i.ibb.co/yWZTJ4j/lego-profile.png" alt="user avatar" className='user-avatar' />
          <div className='plan-text-info'>
            {isEditingTitle ? (
              <input
                type="text"
                value={titleInput}
                onChange={onTitleChange}
                onBlur={onTitleBlur}
                onKeyDown={onTitleKeyDown}
                className="title-edit-input"
                placeholder="제목을 입력하세요"
                autoFocus
              />
            ) : (
              <h2 className='plan-title' onClick={onTitleClick}>
                {planDetails.title ? planDetails.title : (
                  <span className="placeholder-text">제목을 입력하세요</span>
                )} ✎
              </h2>
            )}
            <p className='plan-duration'>{planDurationStr}</p>
          </div>
        </div>
        <div className='plan-budget-right'>
          {(planDetails.usedBudget > planDetails.totalBudget && planDetails.totalBudget > 0) ? (
            <div className="budget-alert">
              <span className="alert-icon">⚠️</span>
              <span>
                <span className="budget-over-amount">
                  ₩{(planDetails.usedBudget - planDetails.totalBudget).toLocaleString()}
                </span>
                &nbsp;초과되었습니다.
              </span>
              <span className="used-budget-bubble">
                ₩ {planDetails.usedBudget.toLocaleString()}
              </span>
            </div>
          ) : (
            <div className='used-budget'>
              ₩ {planDetails.usedBudget.toLocaleString()}
            </div>
          )}

          <div className={
            'budget-progress-bar' +
            (planDetails.usedBudget > planDetails.totalBudget && planDetails.totalBudget > 0 ? ' over' : '')
          }>
            <div
              className={
                'budget-progress-fill' +
                (planDetails.usedBudget > planDetails.totalBudget && planDetails.totalBudget > 0 ? ' over' : '')
              }
              style={{
                width: planDetails.totalBudget > 0
                  ? `${Math.min(100, planDetails.usedBudget / planDetails.totalBudget * 100)}%`
                  : '0%'
              }}
            ></div>
          </div>
          <div className='total-budget'>
            <span>예산</span>
            {isEditingBudget ? (
              <input
                type="number"
                value={budgetInput}
                onChange={onBudgetChange}
                onBlur={onBudgetBlur}
                onKeyDown={onBudgetKeyDown}
                className="budget-input"
                isEditMode={isEditMode}
              />
            ) : (
              <span onClick={onBudgetClick} className="budget-amount-clickable">
                ₩ {planDetails.totalBudget ? planDetails.totalBudget.toLocaleString() : '0'}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* --- 시간표 스케줄 그리드 --- */}
      <div className='schedule-grid'>
        <div className='time-column'>
          <div className='header-cell' style={{ borderBottomColor: '#dee2e6' }}></div>
          {timeSlots.map(time => (
            <div key={time} className='time-cell'>{time}</div>
          ))}
        </div>
        <div className='days-column-container'>
          {days.map(day => (
            <div key={day} className='day-column'>
              <div className='header-cell'>{day}</div>
              <div className="planner-content-wrapper" style={{ position: 'relative', minHeight: slotHeight * timeSlots.length }}>
                {timeSlots.map(time => (
                  <DroppablePlannerCell key={time} day={day} time={time} />
                ))}
                {(schedules[day] || []).map(item => (
                  <ScheduleItem
                    key={item.id || item.cartId || item.placeId}
                    item={item}
                    day={day}
                    slotHeight={slotHeight}
                    isEditMode={isEditMode}
                    onItemDeleted={handleItemDeleted}
                    onItemUpdated={handleItemUpdated}
                    onContextMenu={onContextMenu}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Schedule;
