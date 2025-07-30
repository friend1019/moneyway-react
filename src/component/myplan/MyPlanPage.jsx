import React, { useState, useEffect, useCallback } from 'react';
import { DndContext } from '@dnd-kit/core';
import '../../css/myplan/MyPlanPage.css';
import Header from "../Header";
import Schedule from './Schedule';
import ScheduleCart from './ScheduleCart';
import LodgingCart from './LodgingCart'; 
import ContextMenu from './ContextMenu';
import api from "../../api/axios";

// 겹침 검사(30분 단위, 끝-시작 붙는 건 OK)
const isOverlapping = (newSchedule, existingSchedules) => {
  const getSlotIndex = (time) => {
    const [h, m] = time.split(':').map(Number);
    return (h - 8) * 2 + (m === 30 ? 1 : 0);
  };
  const newStart = getSlotIndex(newSchedule.time);
  const newEnd = newStart + Math.round(newSchedule.duration * 2);
  return existingSchedules.some(existing => {
    if (existing.id === newSchedule.id) return false;
    const existStart = getSlotIndex(existing.time);
    const existEnd = existStart + Math.round(existing.duration * 2);
    return !(newEnd <= existStart || newStart >= existEnd);
  });
};

const MyPlanPage = () => {
  const [planDetails, setPlanDetails] = useState({
    title: '',
    author: '',
    totalBudget: 0,
    usedBudget: 0,
  });
  const [dailySchedules, setDailySchedules] = useState({
    'Day 1': [],
    'Day 2': [],
    'Day 3': [],
    'Day 4': []
  });
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [isEditMode, setIsEditMode] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);

  const [menuState, setMenuState] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    selectedItem: null,
    day: null,
  });

  // cart 불러오기 (한 번만 호출)
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCartItems(res.data.cartItems || []);
    } catch {
      alert('카트 불러오기 실패');
    }
    setLoading(false);
  };

  // 페이지 진입 시 자동 불러오기 (버튼 없어도 됨)
  useEffect(() => {
    fetchCartItems();
  }, []);

  // 사용 일수 계산
  const lastUsedDayNum = Math.max(
    0,
    ...Object.keys(dailySchedules)
      .filter(day => (dailySchedules[day] && dailySchedules[day].length > 0))
      .map(day => parseInt(day.replace('Day ', '')))
  );
  const planDurationStr =
    lastUsedDayNum > 0 ? `${lastUsedDayNum - 1}박 ${lastUsedDayNum}일` : '1박 2일';

  // duration 드래그 조정 (0.5 단위)
  const onDurationDrag = (item, day, newDuration) => {
    if (isNaN(newDuration) || newDuration < 0.5) return;
    setDailySchedules(prev => ({
      ...prev,
      [day]: prev[day].map(d =>
        d.id === item.id ? { ...d, duration: newDuration } : d
      )
    }));
  };

  const SLOT_HEIGHT_PX = 90;

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const origin = active.data.current?.origin;

    if (origin === 'lodging') {
      const draggedItem = active.data.current;
      const [day, time] = over.id.split('-');
      const newScheduleItem = {
        ...draggedItem,
        id: Date.now(),
        time: time,
        duration: 1,
      };
      if (isOverlapping(newScheduleItem, dailySchedules[day] || [])) {
        alert('해당 시간에는 이미 다른 일정이 있습니다.');
        return;
      }
      setDailySchedules(prev => ({ ...prev, [day]: [...(prev[day] || []), newScheduleItem] }));
    } else if (origin === 'cart') {
      const draggedItem = cartItems.find(item => item.cartId === active.id);
      if (!draggedItem) return;
      const [day, time] = over.id.split('-');
      const newScheduleItem = {
        id: Date.now(),
        name: draggedItem.placeName,
        cost: draggedItem.price,
        category: '액티비티',
        time: time,
        duration: 1
      };
      if (isOverlapping(newScheduleItem, dailySchedules[day] || [])) {
        alert('해당 시간에는 이미 다른 일정이 있습니다.');
        return;
      }
      setDailySchedules(prev => ({ ...prev, [day]: [...(prev[day] || []), newScheduleItem] }));
      setCartItems(prev => prev.filter(item => item.cartId !== active.id));
    } else if (origin === 'schedule') {
      const movedItem = active.data.current;
      const originalDay = movedItem.originalDay;
      const [newDay, newTime] = over.id.split('-');
      const updatedItem = { ...movedItem, time: newTime, day: newDay };
      if (isOverlapping(updatedItem, dailySchedules[newDay] || [])) {
        alert('해당 시간에는 이미 다른 일정이 있습니다.');
        return;
      }
      setDailySchedules(prev => {
        const newSchedules = { ...prev };
        newSchedules[originalDay] = newSchedules[originalDay].filter(item => item.id !== movedItem.id);
        newSchedules[newDay] = [...(newSchedules[newDay] || []), updatedItem];
        return newSchedules;
      });
    }
  };

  // 컨텍스트 메뉴 관련
  const closeMenu = useCallback(() => {
    setMenuState(prev => ({ ...prev, visible: false }));
  }, []);
  const handleContextMenu = (event, item, day) => {
    event.preventDefault();
    setMenuState({
      visible: true,
      position: { x: event.clientX, y: event.clientY },
      selectedItem: item,
      day: day,
    });
  };
  const handleDeleteItem = () => {
    const { selectedItem, day } = menuState;
    if (!selectedItem || !day) return;
    setDailySchedules(prev => ({
      ...prev,
      [day]: prev[day].filter(item => item.id !== selectedItem.id)
    }));
    closeMenu();
  };
  const handleViewDetails = () => {
    const { selectedItem } = menuState;
    if (!selectedItem) return;
    alert(`'${selectedItem.name}'의 상세 보기 페이지로 이동합니다.`);
    closeMenu();
  };

  useEffect(() => {
    const allItems = Object.values(dailySchedules).flat();
    const totalCost = allItems.reduce((sum, item) => sum + item.cost, 0);
    setPlanDetails(prevDetails => ({
      ...prevDetails,
      usedBudget: totalCost
    }));
  }, [dailySchedules]);

  // 예산 편집
  const handleBudgetClick = () => {
    setBudgetInput(planDetails.totalBudget);
    setIsEditingBudget(true);
  };
  const handleBudgetChange = (e) => {
    setBudgetInput(e.target.value);
  };
  const handleBudgetBlur = () => {
    const newTotalBudget = parseInt(budgetInput, 10) || 0;
    setPlanDetails(prev => ({ ...prev, totalBudget: newTotalBudget }));
    setIsEditingBudget(false);
  };
  const handleBudgetKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBudgetBlur();
    }
  };

  // 플랜 목록 및 네비게이션
  const [planList, setPlanList] = useState([]);
  const fetchPlanList = async () => {
    try {
      const res = await api.get('/plans');
      setPlanList(res.data);
    } catch {
      setPlanList([]);
    }
  };

  // 플랜 상세 조회
  const fetchPlanDetail = async (planId) => {
    try {
      const res = await api.get(`/plans/${planId}`);
      const data = res.data;
      setPlanDetails({
        title: data.title,
        author: data.username,
        totalBudget: data.totalPrice,
        usedBudget: data.places.reduce((sum, p) => sum + (p.cost || 0), 0)
      });
      // day별 스케줄 변환
      const newSchedules = { 'Day 1': [], 'Day 2': [], 'Day 3': [], 'Day 4': [] };
      data.places.forEach(place => {
        const day = `Day ${place.dayNumber}`;
        if (!newSchedules[day]) newSchedules[day] = [];
        // duration(시간) 계산
        const [sh, sm] = place.startTime.split(':').map(Number);
        const [eh, em] = place.endTime.split(':').map(Number);
        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;
        newSchedules[day].push({
          id: place.cartId || place.id || Date.now() + Math.random(),
          name: place.placeName,
          time: place.startTime.slice(0, 5),
          duration: (endMin - startMin) / 60,
          cost: place.cost || 0,
          cartId: place.cartId,
        });
      });
      setDailySchedules(newSchedules);
    } catch {
      setPlanDetails({
        title: '',
        author: '',
        totalBudget: 0,
        usedBudget: 0,
      });
      setDailySchedules({ 'Day 1': [], 'Day 2': [], 'Day 3': [], 'Day 4': [] });
    }
  };

  // 마운트시 목록 조회, 인덱스 바뀔 때 상세 조회
  useEffect(() => { fetchPlanList(); }, []);
  useEffect(() => {
    if (planList.length > 0) fetchPlanDetail(planList[currentPlanIndex].id);
  }, [planList, currentPlanIndex]);

  const handlePrevPlan = () => {
    setCurrentPlanIndex(idx => (idx > 0 ? idx - 1 : idx));
  };
  const handleNextPlan = () => {
    setCurrentPlanIndex(idx => (idx < planList.length - 1 ? idx + 1 : idx));
  };

  const handleSave = async () => {
    // dailySchedules → places DTO 변환
    const places = [];
    Object.entries(dailySchedules).forEach(([day, items]) => {
      const dayNumber = parseInt(day.replace('Day ', ''));
      items.forEach(item => {
        const [h, m] = item.time.split(':').map(Number);
        const startMin = h * 60 + m;
        const endMin = startMin + Math.round(item.duration * 60);
        const endH = Math.floor(endMin / 60);
        const endM = endMin % 60;
        places.push({
          cartId: item.cartId || item.id,
          dayNumber,
          startTime: item.time + ':00',
          endTime: `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`,
        });
      });
    });

    const payload = {
      title: planDetails.title,
      totalPrice: planDetails.totalBudget,
      places,
    };

    try {
      await api.post('/plans', payload);
      alert('일정이 성공적으로 저장되었습니다.');
      setIsEditMode(false);
      fetchPlanList(); // 목록 갱신
    } catch (e) {
      alert('저장 실패! ' + (e.response?.data?.message || ''));
    }
  };

  const handleTitleClick = () => {
    setTitleInput(planDetails.title);
    setIsEditingTitle(true);
  };
  const handleTitleChange = (e) => {
    setTitleInput(e.target.value);
  };
  const handleTitleBlur = () => {
    setPlanDetails(prev => ({ ...prev, title: titleInput }));
    setIsEditingTitle(false);
  };
  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  const menuItems = [
    { label: '일정 상세보기', action: handleViewDetails },
    { label: '삭제하기', action: handleDeleteItem },
  ];
  useEffect(() => {
    if (menuState.visible) {
      window.addEventListener('click', closeMenu);
    }
    return () => {
      window.removeEventListener('click', closeMenu);
    };
  }, [menuState.visible, closeMenu]);

  const handleEdit = () => setIsEditMode(true);

  // 타임 슬롯 (08:00 ~ 22:30, 30분 단위)
  const timeSlots = [];
  for (let h = 8; h < 23; h++) {
    timeSlots.push(`${String(h).padStart(2, '0')}:00`);
    timeSlots.push(`${String(h).padStart(2, '0')}:30`);
  }

  return (
    <DndContext onDragEnd={handleDragEnd} disabled={!isEditMode}>
      <Header />
      <div className='myplan-page-container'>
        {/* 좌측: 숙소 카트 (cartItems만 넘김, 내부에서 '숙소'만 필터) */}
        {isEditMode ? <LodgingCart cartItems={cartItems} /> : <div className="side-card-container-placeholder"></div>}
        {/* 중앙: 시간표 */}
        <div className="center-column">
          <div className='schedule-header'>
            <div className="plan-sequence">
              <button className="plan-arrow" onClick={handlePrevPlan}>&lt;</button>
              <span className='plan-breadcrumb'>
                {planList[currentPlanIndex]?.title || `${currentPlanIndex + 1}번째 플랜 `}
              </span>
              <button className="plan-arrow" onClick={handleNextPlan}>&gt;</button>
            </div>
            {isEditMode ? (
              <button className='save-button' onClick={handleSave}>저장하기</button>
            ) : (
              <button className='edit-button' onClick={handleEdit}>수정하기</button>
            )}

          </div>
          <div className='schedule-main-container'>
            <Schedule
              isEditingTitle={isEditingTitle}
              titleInput={titleInput}
              onTitleClick={handleTitleClick}
              onTitleChange={handleTitleChange}
              onTitleBlur={handleTitleBlur}
              onTitleKeyDown={handleTitleKeyDown}
              planDetails={planDetails}
              dailySchedules={dailySchedules}
              timeSlots={timeSlots}
              onContextMenu={handleContextMenu}
              slotHeight={SLOT_HEIGHT_PX}
              isEditMode={isEditMode}
              isEditingBudget={isEditingBudget}
              onBudgetClick={handleBudgetClick}
              onBudgetChange={handleBudgetChange}
              onBudgetBlur={handleBudgetBlur}
              onBudgetKeyDown={handleBudgetKeyDown}
              budgetInput={budgetInput}
              onDurationDrag={onDurationDrag}
              planDurationStr={planDurationStr}
            />
          </div>
        </div>
        {/* 우측: 일정 카트 */}
        {isEditMode ? <ScheduleCart cartItems={cartItems} /> : <div className="side-card-container-placeholder"></div>}
      </div>
      {isEditMode && menuState.visible && (
        <ContextMenu 
          position={menuState.position} 
          items={menuItems}
          onClose={closeMenu}
        />
      )}
    </DndContext>
  );
};

export default MyPlanPage;
