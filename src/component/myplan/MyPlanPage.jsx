import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DndContext } from '@dnd-kit/core';
import { useParams, useLocation } from 'react-router-dom';
import '../../css/myplan/MyPlanPage.css';
import Header from "../common/Header";
import Schedule from './Schedule';
import ScheduleCart from './ScheduleCart';
import LodgingCart from './LodgingCart';
import ContextMenu from './ContextMenu';
import TimeSelectionModal from './TimeSelectionModal';
import api from "../../api/axios";

/** ---------- 시간/겹침 유틸 (1시간 단위) ---------- */
const SLOT_START_HOUR = 8;
const SLOT_END_HOUR = 23; // 마지막 표시시간 (종료 상한)
const toSlotIndex = (time) => {
  const [h] = time.split(':').map(Number);
  return h - SLOT_START_HOUR; // 08:00 -> 0, 09:00 -> 1 ...
};
const isOverlapping = (newSchedule, existingSchedules) => {
  const newStart = toSlotIndex(newSchedule.time);
  const newEnd = newStart + Math.round(newSchedule.duration); // duration은 시간 단위
  return existingSchedules.some(existing => {
    if (existing.id === newSchedule.id) return false;
    const existStart = toSlotIndex(existing.time);
    const existEnd = existStart + Math.round(existing.duration);
    return !(newEnd <= existStart || newStart >= existEnd);
  });
};
const clampToRangeHHMMSS = (minutes) => {
  const min = SLOT_START_HOUR * 60;
  const max = SLOT_END_HOUR * 60;
  const mm = Math.min(Math.max(minutes, min), max);
  const h = Math.floor(mm / 60);
  const m = mm % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
};

/** ---------- 페이지 ---------- */
const MyPlanPage = () => {
  const { planId } = useParams(); // /myplan/:planId 에서 사용

  const [planDetails, setPlanDetails] = useState({
    id: null,
    title: '',
    author: '',
    totalBudget: 0,
    usedBudget: 0,
  });

  const emptyDays = useMemo(
    () => ({ 'Day 1': [], 'Day 2': [], 'Day 3': [], 'Day 4': [] }),
    []
  );
  const [dailySchedules, setDailySchedules] = useState(emptyDays);

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [isEditMode, setIsEditMode] = useState(true);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  const location = useLocation();
  const isNewPlan = location.state?.isNewPlan;
  // 시간 선택 모달
  const [timeModal, setTimeModal] = useState({
    isOpen: false,
    step: 'start',
    draggedItem: null,
    targetDay: null,
    selectedStartTime: null,
  });

  // 컨텍스트 메뉴
  const [menuState, setMenuState] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    selectedItem: null,
    day: null,
  });

  /** ---------- 외부 데이터 ---------- */
  const fetchCartItems = async () => {
    setLoadingCart(true);
    try {
      const res = await api.get('/cart');
      setCartItems(res.data.cartItems || []);
    } catch {
      alert('카트를 불러오지 못했습니다.');
    } finally {
      setLoadingCart(false);
    }
  };

  const fetchPlanDetail = async (id) => {
    setLoadingPlan(true);
    try {
      const res = await api.get(`/plans/${id}`);
      const data = res.data;

      setPlanDetails({
        id: data.id ?? data.planId ?? id,
        title: data.title ?? '',
        author: data.username ?? '',
        totalBudget: data.totalPrice ?? 0,
        usedBudget: (data.places || []).reduce((sum, p) => sum + (p.cost || 0), 0),
      });

      const newSchedules = { 'Day 1': [], 'Day 2': [], 'Day 3': [], 'Day 4': [] };
      (data.places || []).forEach(place => {
        const day = `Day ${place.dayNumber}`;
        if (!newSchedules[day]) newSchedules[day] = [];
        // duration은 서버 endTime/startTime으로 계산 가능하지만, 여기서는 1시간 기본
        const start = (place.startTime || '09:00:00').slice(0,5);
        const end = (place.endTime || '10:00:00').slice(0,5);
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const duration = Math.max(1, ((eh*60 + em) - (sh*60 + sm)) / 60);

        newSchedules[day].push({
          id: place.placeId || Date.now() + Math.random(),
          name: place.placeName,
          time: start,
          duration,
          cost: place.cost || 0,
          cartId: place.cartId,  // 생성 시 사용했던 cartId가 있을 수 있음
          placeId: place.placeId, // 수정 시 필요
          category: place.category
        });
      });
      setDailySchedules(newSchedules);
    } catch (e) {
      console.error('GET /plans/{id} 실패:', e);
      setPlanDetails({ id: id ?? null, title: '', author: '', totalBudget: 0, usedBudget: 0 });
      setDailySchedules(emptyDays);
    } finally {
      setLoadingPlan(false);
    }
  }

  useEffect(() => { fetchCartItems(); }, []);
  useEffect(() => {
    if (planId) {
      fetchPlanDetail(planId);
      setIsEditMode(!!isNewPlan); 
    }
  }, [planId, isNewPlan]);

  /** ---------- 파생 정보 ---------- */
  const activeDayCount = useMemo(
    () => Object.values(dailySchedules).filter(daySchedule => daySchedule.length > 0).length,
    [dailySchedules]
  );
  const planDurationStr = activeDayCount > 0 ? `${activeDayCount - 1}박 ${activeDayCount}일` : '0박 0일';

  const SLOT_HEIGHT_PX = 90;

  const timeSlots = useMemo(() => {
    const arr = [];
    for (let h = SLOT_START_HOUR; h < SLOT_END_HOUR; h++) {
      arr.push(`${String(h).padStart(2, '0')}:00`);
    }
    return arr;
  }, []);

  /** ---------- DnD ---------- */
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const origin = active.data.current?.origin;

    // 숙소 카드는 드래그 불가 정책
    if (origin === 'lodging') return;

    if (origin === 'cart') {
      const draggedItem = cartItems.find(item => item.cartId === active.id);
      if (!draggedItem) return;

      const [day] = over.id.split('-'); // 'Day 1-09:00' 형태라면 첫 파트만
      setTimeModal({
        isOpen: true,
        step: 'start',
        draggedItem,
        targetDay: day,
        selectedStartTime: null,
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
        const ns = { ...prev };
        ns[originalDay] = ns[originalDay].filter(item => item.id !== movedItem.id);
        ns[newDay] = [...(ns[newDay] || []), updatedItem];
        return ns;
      });
    }
  };

  /** ---------- 시간 모달 ---------- */
  const handleTimeConfirm = (selectedTime) => {
    const { step, draggedItem, targetDay, selectedStartTime } = timeModal;

    if (step === 'start') {
      setTimeModal(prev => ({ ...prev, step: 'end', selectedStartTime: selectedTime }));
      return;
    }

    // 종료 선택 완료
    const startTime = selectedStartTime;
    const endTime = selectedTime;

    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
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

    if (isOverlapping(newScheduleItem, dailySchedules[targetDay] || [])) {
      alert('해당 시간에는 이미 다른 일정이 있습니다.');
      setTimeModal({ isOpen: false, step: 'start', draggedItem: null, targetDay: null, selectedStartTime: null });
      return;
    }

    setDailySchedules(prev => ({
      ...prev,
      [targetDay]: [...(prev[targetDay] || []), newScheduleItem]
    }));
    setCartItems(prev => prev.filter(item => item.cartId !== draggedItem.cartId));

    setTimeModal({ isOpen: false, step: 'start', draggedItem: null, targetDay: null, selectedStartTime: null });
  };

  const handleTimeModalClose = () => {
    setTimeModal({ isOpen: false, step: 'start', draggedItem: null, targetDay: null, selectedStartTime: null });
  };

  /** ---------- 컨텍스트 메뉴 ---------- */
  const closeMenu = useCallback(() => {
    setMenuState(prev => ({ ...prev, visible: false }));
  }, []);
  const handleContextMenu = (event, item, day) => {
    event.preventDefault();
    setMenuState({
      visible: true,
      position: { x: event.clientX + window.scrollX, y: event.clientY + window.scrollY },
      selectedItem: item,
      day,
    });
  };
  const handleDeleteItem = () => {
    const { selectedItem, day } = menuState;
    if (!selectedItem || !day) return;

    setDailySchedules(prev => ({
      ...prev,
      [day]: prev[day].filter(item => item.id !== selectedItem.id)
    }));

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
    if (menuState.visible) window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [menuState.visible, closeMenu]);

  useEffect(() => {
    const allItems = Object.values(dailySchedules).flat();
    const totalCost = allItems.reduce((sum, item) => sum + (item.cost || 0), 0);
    setPlanDetails(prev => ({ ...prev, usedBudget: totalCost }));
  }, [dailySchedules]);

  const handleBudgetClick = () => { setBudgetInput(planDetails.totalBudget); setIsEditingBudget(true); };
  const handleBudgetChange = (e) => setBudgetInput(e.target.value);
  const handleBudgetBlur = () => {
    const newTotalBudget = parseInt(budgetInput, 10) || 0;
    setPlanDetails(prev => ({ ...prev, totalBudget: newTotalBudget }));
    setIsEditingBudget(false);
  };
  const handleBudgetKeyDown = (e) => { if (e.key === 'Enter') handleBudgetBlur(); };

  const handleTitleClick = () => { setTitleInput(planDetails.title); setIsEditingTitle(true); };
  const handleTitleChange = (e) => setTitleInput(e.target.value);
  const handleTitleBlur = () => { setPlanDetails(prev => ({ ...prev, title: titleInput })); setIsEditingTitle(false); };
  const handleTitleKeyDown = (e) => { if (e.key === 'Enter') handleTitleBlur(); };

  /** ---------- 저장/수정 ---------- */
  const handleSave = async () => {
    const places = [];
  
    Object.entries(dailySchedules).forEach(([day, items]) => {
      const dayNumber = Number(String(day).replace('Day ', '')) || Number(day);
  
      items.forEach((item) => {
        if (!item?.time || !item?.cartId) return; // 시간/카트 없는 건 스킵
  
        const [h, m] = item.time.split(':').map(Number);
        const startMinutes = h * 60 + m;
        const rawEnd = startMinutes + Math.round((item.duration || 1) * 60);
  
        // 08:00~23:00 클램프
        const MIN = SLOT_START_HOUR * 60; // 480
        const MAX = SLOT_END_HOUR * 60;   // 1380
        const clamp = (v) => Math.min(Math.max(v, MIN), MAX);
        const s = clamp(startMinutes);
        let e = clamp(rawEnd);
  
        // 0분 구간 방지 (필요 없으면 삭제)
        if (e <= s) {
          if (s + 10 > MAX) return; // 23:00 넘으면 스킵
          e = s + 10;
        }
  
        const toHHMMSS = (mins) => {
          const H = String(Math.floor(mins / 60)).padStart(2, '0');
          const M = String(mins % 60).padStart(2, '0');
          return `${H}:${M}:00`;
        };
  
        places.push({
          cartId: item.cartId,
          dayNumber,
          startTime: toHHMMSS(s),
          endTime: toHHMMSS(e),
        });
      });
    });
  
    if (!places.length) return alert('스케줄에 추가된 일정이 없습니다!');
    if (!planId) return alert('유효하지 않은 접근입니다. 계획 ID가 없습니다.');
  
    const payload = {
      title: planDetails?.title || '새 여행 계획',
      totalPrice: Number(planDetails?.totalBudget || 0),
      places, // 전부 cartId만 포함
    };
  
    try {
      console.log(`[UPDATE] PATCH /plans/${planId}`, payload);
      await api.patch(`/plans/${planId}`, payload);
      alert('여행 계획이 성공적으로 저장되었습니다.');
      setIsEditMode(false);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      console.error('ERROR:', e?.response || e);
      alert(`저장 실패! ${msg}`);
    }
  };
  
  

  const handleEdit = () => setIsEditMode(true);

  const menuItems = [
    { label: '일정 상세보기', action: handleViewDetails },
    { label: '삭제하기', action: handleDeleteItem },
  ];

  return (
    <DndContext onDragEnd={handleDragEnd} disabled={!isEditMode}>
      <Header />
      <div className='myplan-page-container'>
        <LodgingCart cartItems={cartItems} isEditMode={isEditMode} />
        <div className="center-column">
          <div className='schedule-header'>
            <div className="plan-sequence">
              <span className='plan-breadcrumb'>
                {planDetails.title || '새 여행 계획'}
              </span>
            </div>
            {isEditMode ? (
              <button className='save-button' onClick={handleSave}>저장하기</button>
            ) : (
              <button className='edit-button' onClick={handleEdit}>수정하기</button>
            )}
          </div>

          {(loadingPlan || loadingCart) && (
            <div className="loading-box">불러오는 중…</div>
          )}

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

        {isEditMode
          ? <ScheduleCart cartItems={cartItems} dailySchedules={dailySchedules} />
          : <div className="side-card-container-placeholder"></div>}
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
