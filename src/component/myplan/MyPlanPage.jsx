import React, { useState, useEffect, useCallback } from 'react';
import { DndContext } from '@dnd-kit/core';
import '../../css/myplan/MyPlanPage.css';
import Header from "../common/Header";
import Schedule from './Schedule';
import ScheduleCart from './ScheduleCart';
import LodgingCart from './LodgingCart';
import ContextMenu from './ContextMenu';
import TimeSelectionModal from './TimeSelectionModal';
import api from "../../api/axios";

const isOverlapping = (newSchedule, existingSchedules) => {
  const getSlotIndex = (time) => {
    const [h, m] = time.split(':').map(Number);
    return (h - 8) * 2 + (m === 30 ? 1 : 0); // 30분 단위
  };
  const newStart = getSlotIndex(newSchedule.time);
  const newEnd = newStart + Math.round(newSchedule.duration * 2); // duration 고려
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
  
  // 시간 선택 모달 상태
  const [timeModal, setTimeModal] = useState({
    isOpen: false,
    step: 'start', // 'start' 또는 'end'
    draggedItem: null,
    targetDay: null,
    selectedStartTime: null,
    selectedEndTime: null,
  });

  // 메뉴 위치가 카드 기준으로 잡히게 하기 위해 ref 추가
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

  useEffect(() => { fetchCartItems(); }, []);

  // 사용 일수 계산
  const lastUsedDayNum = Math.max(
    0,
    ...Object.keys(dailySchedules)
      .filter(day => (dailySchedules[day] && dailySchedules[day].length > 0))
      .map(day => parseInt(day.replace('Day ', '')))
  );
  // 기본 0박 0일로 표시
  const planDurationStr =
    lastUsedDayNum > 0 ? `${lastUsedDayNum - 1}박 ${lastUsedDayNum}일` : '0박 0일';

  const SLOT_HEIGHT_PX = 90; // 1시간 단위로 다시 변경

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const origin = active.data.current?.origin;

    // 숙소 드래그는 처리하지 않음
    if (origin === 'lodging') {
      return; // 숙소는 드래그 불가능
    } else if (origin === 'cart') {
      const draggedItem = cartItems.find(item => item.cartId === active.id);
      if (!draggedItem) return;
      
      const [day, time] = over.id.split('-');
      
      // 시간 선택 모달 열기
      setTimeModal({
        isOpen: true,
        step: 'start',
        draggedItem: draggedItem,
        targetDay: day,
        selectedStartTime: null,
        selectedEndTime: null,
      });
      
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
  
  // 시간 선택 모달 핸들러
  const handleTimeConfirm = (selectedTime) => {
    const { step, draggedItem, targetDay, selectedStartTime } = timeModal;
    
    if (step === 'start') {
      // 시작 시간 선택 완료, 종료 시간 선택으로 이동
      setTimeModal(prev => ({
        ...prev,
        step: 'end',
        selectedStartTime: selectedTime,
      }));
    } else {
      // 종료 시간 선택 완료, 스케줄에 추가
      const startTime = selectedStartTime;
      const endTime = selectedTime;
      
      // 시간 계산 (분 단위)
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const durationHours = (endMinutes - startMinutes) / 60;
      
      if (durationHours <= 0) {
        alert('종료 시간은 시작 시간보다 늦어야 합니다.');
        return;
      }
      
      const newScheduleItem = {
        id: Date.now(),
        name: draggedItem.placeName,
        cost: draggedItem.price,
        category: draggedItem.category,
        time: startTime,
        duration: durationHours,
        cartId: draggedItem.cartId
      };
      
      // 겹침 체크
      if (isOverlapping(newScheduleItem, dailySchedules[targetDay] || [])) {
        alert('해당 시간에는 이미 다른 일정이 있습니다.');
        setTimeModal({ isOpen: false, step: 'start', draggedItem: null, targetDay: null, selectedStartTime: null, selectedEndTime: null });
        return;
      }
      
      // 스케줄에 추가
      setDailySchedules(prev => ({ 
        ...prev, 
        [targetDay]: [...(prev[targetDay] || []), newScheduleItem] 
      }));
      
      // 카트에서 제거
      setCartItems(prev => prev.filter(item => item.cartId !== draggedItem.cartId));
      
      // 모달 닫기
      setTimeModal({ 
        isOpen: false, 
        step: 'start', 
        draggedItem: null, 
        targetDay: null, 
        selectedStartTime: null, 
        selectedEndTime: null 
      });
    }
  };
  
  const handleTimeModalClose = () => {
    setTimeModal({ 
      isOpen: false, 
      step: 'start', 
      draggedItem: null, 
      targetDay: null, 
      selectedStartTime: null, 
      selectedEndTime: null 
    });
  };

  // 컨텍스트 메뉴 관련
  const closeMenu = useCallback(() => {
    setMenuState(prev => ({ ...prev, visible: false }));
  }, []);
  
  // 카드의 ref를 받아와서 위치를 계산
  const handleContextMenu = (event, item, day) => {
    event.preventDefault();
    // 타겟 기준 상대적 위치(카드 바로 아래)로 띄움
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuState({
      visible: true,
      position: {
        x: rect.left,
        y: rect.top + rect.height + window.scrollY + 4, // 아래로 살짝 띄우기
      },
      selectedItem: item,
      day: day,
    });
  };

  const handleDeleteItem = () => {
    const { selectedItem, day } = menuState;
    if (!selectedItem || !day) return;
    
    // 스케줄에서 삭제
    setDailySchedules(prev => ({
      ...prev,
      [day]: prev[day].filter(item => item.id !== selectedItem.id)
    }));
    
    // cartId가 있다면 카트 목록에 다시 추가
    if (selectedItem.cartId) {
      const cartItem = {
        cartId: selectedItem.cartId,
        placeName: selectedItem.name,
        category: selectedItem.category,
        price: selectedItem.cost,
      };
      setCartItems(prev => [...prev, cartItem]);
    }
    
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
    const totalCost = allItems.reduce((sum, item) => sum + (item.cost || 0), 0);
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
        newSchedules[day].push({
          id: place.placeId || Date.now() + Math.random(),
          name: place.placeName,
          time: place.startTime.slice(0, 5),
          duration: 1, // 항상 1시간 고정
          cost: place.cost || 0,
          cartId: place.cartId,
          placeId: place.placeId,
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
    const places = [];
    Object.entries(dailySchedules).forEach(([day, items]) => {
      const dayNumber = parseInt(day.replace('Day ', ''));
      items.forEach(item => {
        // cartId가 있는 아이템만 저장
        if (!item.cartId) return;
        const [h, m] = item.time.split(':').map(Number);
        const startTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
        
        // duration을 사용하여 종료 시간 계산
        const totalMinutes = h * 60 + m + (item.duration * 60);
        const endH = Math.floor(totalMinutes / 60);
        const endM = totalMinutes % 60;
        const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;
        
        places.push({
          cartId: item.cartId,
          dayNumber,
          startTime,
          endTime,
        });
      });
    });
    
    if (places.length === 0) {
      alert('스케줄에 추가된 일정이 없습니다!');
      return;
    }
    
    const payload = {
      title: planDetails.title,
      totalPrice: planDetails.totalBudget,
      places,
    };

    try {
      await api.post('/plans', payload);
      alert('일정이 성공적으로 저장되었습니다.');
      setIsEditMode(false);
      
      // 저장 후에도 현재 스케줄 상태 유지 (fetchPlanList 제거)
      // fetchPlanList(); // 이 줄을 제거하여 스케줄이 사라지지 않게 함
      
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

  // 메뉴 항목
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

  // 타임 슬롯 (08:00 ~ 22:00, 1시간 단위)
  const timeSlots = [];
  for (let h = 8; h < 23; h++) {
    timeSlots.push(`${String(h).padStart(2, '0')}:00`);
  }

  return (
    <DndContext onDragEnd={handleDragEnd} disabled={!isEditMode}>
      <Header />
      <div className='myplan-page-container'>
        <LodgingCart cartItems={cartItems} isEditMode={isEditMode} />
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
              planDurationStr={planDurationStr}
            />
        
        {/* 시간 선택 모달 */}
        <TimeSelectionModal
          isOpen={timeModal.isOpen}
          onClose={handleTimeModalClose}
          onConfirm={handleTimeConfirm}
          itemName={timeModal.draggedItem?.placeName}
          category={timeModal.draggedItem?.category}
          step={timeModal.step}
        />
          </div>
        </div>
        {isEditMode ? <ScheduleCart cartItems={cartItems} dailySchedules={dailySchedules} /> : <div className="side-card-container-placeholder"></div>}
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