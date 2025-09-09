import React, { useState, useEffect } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import '../../css/myplan/Schedule.css';

import BudgetDisplay from './BudgetDisplay';

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
  onDurationDrag,
  ...props
}) => {
  const [schedules, setSchedules] = useState({
    "Day 1": [],
    "Day 2": [],
    "Day 3": [],
    "Day 4": [],
    ...dailySchedules
  });

  useEffect(() => { setSchedules(prev => ({ ...prev, ...dailySchedules })); }, [dailySchedules]);

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

  const [openDays, setOpenDays] = useState(1);
  const [planDurationStr, setPlanDurationStr] = useState("0박 1일");

  useEffect(() => {
    const nights = openDays - 1;
    setPlanDurationStr(`${nights}박 ${openDays}일`);
  }, [openDays]);

  // 기본 이미지 fallback 함수
  const getProfileImage = () => {
    // 1. profileImageUrl이 있으면 사용
    if (planDetails.profileImageUrl) {
      return planDetails.profileImageUrl;
    }
    
    // 2. thumbnailUrl이 있으면 사용
    if (planDetails.thumbnailUrl) {
      return planDetails.thumbnailUrl;
    }
    
    // 3. 둘 다 없으면 기본 이미지 생성
    const username = planDetails.username || planDetails.author || '사용자';
    const firstChar = username.charAt(0).toUpperCase();
    
    return `data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%23FFD3E0%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%22%20y%3D%2250%22%20font-family%3D%22%27Arial%27%2C%20sans-serif%22%20font-size%3D%2250%22%20fill%3D%22%23FFFFFF%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3E${firstChar}%3C%2Ftext%3E%0A%3C%2Fsvg%3E%0A`;
  };

  const handleImageError = (e) => {
    // 이미지 로드 실패 시 기본 이미지로 대체
    console.warn('Profile image failed to load, using fallback');
    const username = planDetails.username || planDetails.author || '사용자';
    const firstChar = username.charAt(0).toUpperCase();
    
    e.target.src = `data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%23FFD3E0%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%22%20y%3D%2250%22%20font-family%3D%22%27Arial%27%2C%20sans-serif%22%20font-size%3D%2250%22%20fill%3D%22%23FFFFFF%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3E${firstChar}%3C%2Ftext%3E%0A%3C%2Fsvg%3E%0A`;
  };

  return (
    <>
      <div className='plan-info-card'>
        <div className='plan-details-left'>
          <img
            src={getProfileImage()}
            alt="user avatar"
            className='user-avatar'
            onError={handleImageError}
            onLoad={() => console.log('Profile image loaded successfully')}
          />
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
              <h2
                className={`plan-title ${isEditMode ? 'editable' : ''}`}
                onClick={isEditMode ? onTitleClick : undefined}
              >
                {planDetails.title ? planDetails.title : (
                  <span className="placeholder-text">제목을 입력하세요</span>
                )}
                {isEditMode && ' ✎'}
              </h2>
            )}
            <p className='plan-duration'>{planDurationStr}</p>
          </div>
        </div>
        <BudgetDisplay
          usedBudget={planDetails.usedBudget || 0}
          totalBudget={planDetails.totalBudget || 0}
          isEditMode={isEditMode}
          isEditingBudget={isEditingBudget}
          budgetInput={budgetInput}
          onBudgetClick={onBudgetClick}
          onBudgetChange={onBudgetChange}
          onBudgetBlur={onBudgetBlur}
          onBudgetKeyDown={onBudgetKeyDown}
        />
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
          {["Day 1", "Day 2", "Day 3", "Day 4"].map((day, idx) => {
            const isOpen = idx < openDays;
            return (
              <div key={day} className={`day-column ${!isOpen ? "disabled" : ""}`}>
                <div className='header-cell'>{day}</div>

                {/* 1. 이 Wrapper는 항상 렌더링하여 그리드의 배경을 만듭니다. */}
                <div
                  className="planner-content-wrapper"
                  style={{ minHeight: `${timeSlots.length * 10}rem` }}
                >
                  {/* 2. 그리드 선(PlannerCell)은 항상 렌더링되도록 바깥으로 뺍니다. */}
                  {timeSlots.map(time => (
                    <DroppablePlannerCell key={time} day={day} time={time} />
                  ))}

                  {/* 3. 날짜가 열려있으면 스케줄 아이템을 보여줍니다. */}
                  {isOpen && (schedules[day] || []).map(item => (
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
                  
                  {/* 4. 날짜가 닫혀있고 수정 모드일 때, 그리드 위에 오버레이를 겹칩니다. */}
                  {!isOpen && isEditMode && (
                    <div className="day-locked-mask">
                      <div
                        className="day-locked-overlay"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDays(prev => Math.min(prev + 1, 4));
                        }}
                      >
                        <span className="plus">+</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Schedule;