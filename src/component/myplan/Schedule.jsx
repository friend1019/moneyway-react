import React, { useState, useEffect } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import '../../css/myplan/Schedule.css';

import hotelIcon from "../../images/shopping/hotel.svg";
import cafeIcon from "../../images/shopping/cafe.svg";
import activityIcon from "../../images/shopping/activity.svg";
import foodIcon from "../../images/shopping/food.svg";
import shoppingIcon from "../../images/shopping/shopping.svg";
import tourIcon from "../../images/shopping/tour.svg";

const CATEGORY_ORDER = [
  { name: "숙소", icon: hotelIcon },
  { name: "식당", icon: foodIcon },
  { name: "관광지", icon: tourIcon },
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
  item, day, slotHeight, isEditMode, onItemDeleted, onItemUpdated, onContextMenu, timeSlotsLength,
}) => {
  const uniqueId = item.id || item.cartId || item.placeId;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: uniqueId,
    data: { ...item, origin: 'schedule', originalDay: day },
    disabled: !isEditMode,
  });

  function getTimeTop(time) {
    const [h, m] = time.split(':').map(Number);
    return ((h - 8) + (m >= 30 ? 0.5 : 0)) * 10;
  }

  const H_MARGIN_REM = 1;
  const V_GAP_REM = 2;

  const GRID_TOTAL_REM = timeSlotsLength * 10; // 전체 그리드 높이

  const startTop = getTimeTop(item.time) + V_GAP_REM / 2;
  let height = (item.duration || 1) * 10 - V_GAP_REM;

  if (startTop + height > GRID_TOTAL_REM) {
    height = GRID_TOTAL_REM - startTop;
    if (height < 0) height = 0; 
  }

  const style = {
    top: `${startTop}rem`,
    height: `${height}rem`,   
    left: `${H_MARGIN_REM}rem`,
    right: `${H_MARGIN_REM}rem`,
    position: 'absolute',
    zIndex: transform ? 999 : 'auto',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: isDragging ? 'none' : 'box-shadow 0.1s'
  };
  const dragAreaStyle = {
    width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,
    zIndex: 2, cursor: isEditMode ? 'grab' : 'default', background: 'none'
  };

  const handleContextMenu = (e) => {
    if (!isEditMode) return;
    if (onContextMenu) onContextMenu(e, item, day);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`schedule-item schedule-item-card ${toCssCategory(item.category)}`}
      onContextMenu={handleContextMenu}
    >
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
        <div className="item-cost">₩ {(item.cost || item.price || 0).toLocaleString()}</div>
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

 
  const handleItemUpdated = (updatedItem, day) => {
    setSchedules(prev => ({
      ...prev,
      [day]: prev[day].map(d => d.id === updatedItem.id ? updatedItem : d)
    }));
  };

  const days = Object.keys(schedules || {});

  return (
    <>
      <div className='plan-info-card'>
        <div className='plan-details-left'>
          <img src={planDetails.author.profileImageUrl} alt="user avatar" className='user-avatar' />
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
                  ₩{((planDetails.usedBudget || 0) - (planDetails.totalBudget || 0)).toLocaleString()}
                </span>
                &nbsp;초과되었습니다.
              </span>
              <span className="used-budget-bubble">
                ₩ {(planDetails.usedBudget || 0).toLocaleString()}
              </span>
            </div>
          ) : (
              <div className='used-budget'>
                ₩ {(planDetails.usedBudget || 0).toLocaleString()}
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
              />
            ) : (
              <span onClick={onBudgetClick} className="budget-amount-clickable">
                ₩ {(planDetails.totalBudget || 0).toLocaleString()}
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
              <div className="planner-content-wrapper" style={{ 
                position: 'relative', 
                minHeight: `${timeSlots.length * 10}rem` // 1시간 단위이므로 10rem씩
              }}>
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
                    timeSlotsLength={timeSlots.length}
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