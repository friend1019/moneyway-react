import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DndContext } from '@dnd-kit/core';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
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
const SLOT_END_HOUR = 23;
const toSlotIndex = (time) => {
  const [h] = String(time || '08:00').split(':').map(Number);
  return h - SLOT_START_HOUR;
};
const isOverlapping = (newSchedule, existingSchedules) => {
  const newStart = toSlotIndex(newSchedule.time);
  const newEnd = newStart + Math.round(newSchedule.duration);
  return (existingSchedules || []).some(existing => {
    if (existing.id === newSchedule.id) return false;
    const existStart = toSlotIndex(existing.time);
    const existEnd = existStart + Math.round(existing.duration);
    return !(newEnd <= existStart || newStart >= existEnd);
  });
};

/** ---------- 페이지 ---------- */
const MyPlanPage = () => {
  const { planId: planIdParam } = useParams();
  const planId = String(planIdParam ?? '');
  const navigate = useNavigate();

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
  const [pageLoading, setPageLoading] = useState(false);

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [isEditMode, setIsEditMode] = useState(true);

  const [allPlanIds, setAllPlanIds] = useState([]);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  const [isDirty, setIsDirty] = useState(false);

  const location = useLocation();
  const isNewPlan = location.state?.isNewPlan;

  // 🔹 Day + 열기 상태
  const [enabledDays, setEnabledDays] = useState(1);
  const handleAddDay = useCallback(() => {
    setEnabledDays((d) => Math.min(4, d + 1));
  }, []);

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
    contextType: 'schedule',
  });

  /** ---------- 외부 데이터 ---------- */
  const fetchCartItems = async () => {
    setLoadingCart(true);
    try {
      const res = await api.get('/cart');
      setCartItems(res.data?.cartItems || []);
    } catch (error) {
      console.error('카트 불러오기 실패:', error);
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

      const finalThumbnail =
        data.thumbnailUrl ||
        data.profileImageUrl ||
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='80'><rect width='100%' height='100%' fill='%23eef2ff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='12'>No Image</text></svg>";

      setPlanDetails({
        id: String(data.id ?? data.planId ?? id),
        title: data.title ?? '',
        thumbnailUrl: finalThumbnail,       
        totalBudget: Number(data.totalPrice ?? 0),
        usedBudget: Number(data.currentPrice ?? 0),
        period: data.period ?? null,
      });
      const newSchedules = { 'Day 1': [], 'Day 2': [], 'Day 3': [], 'Day 4': [] };
      (data.places || []).forEach(place => {
        const day = `Day ${place.dayNumber}`;
        if (!newSchedules[day]) newSchedules[day] = [];

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
          cartId: place.cartId,
          placeId: place.placeId,
          category: place.category
        });
      });
      setDailySchedules(newSchedules);
      setIsDirty(false);
    } catch (e) {
      console.error('GET /plans/{id} 실패:', e);
      setPlanDetails({ id: String(id ?? ''), title: '', author: '', totalBudget: 0, usedBudget: 0 });
      setDailySchedules(emptyDays);
    } finally {
      setLoadingPlan(false);
    }
  };

  const fetchAllPlanIds = async () => {
    try {
      const res = await api.get('/plans');
      const ids = (res.data || [])
        .map(plan => String(plan.id ?? plan.planId))
        .filter(Boolean);
      setAllPlanIds(prev => {
        const cur = String(planId || '');
        if (cur && !ids.includes(cur)) return [...ids, cur];
        return ids;
      });
    } catch (e) {
      console.error("전체 계획 목록을 불러오지 못했습니다.", e);
      setAllPlanIds(prev => {
        const cur = String(planId || '');
        if (cur && !prev.includes(cur)) return [...prev, cur];
        return prev;
      });
    }
  };

  // prev/next 계산
  const { prevPlanId, nextPlanId } = useMemo(() => {
    const currentIndex = allPlanIds.indexOf(String(planId));
    if (currentIndex === -1) {
      return { prevPlanId: null, nextPlanId: null };
    }
    const prev = currentIndex > 0 ? allPlanIds[currentIndex - 1] : null;
    const next = currentIndex < allPlanIds.length - 1 ? allPlanIds[currentIndex + 1] : null;
    return { prevPlanId: prev, nextPlanId: next };
  }, [allPlanIds, planId]);

  const navigateToPlan = useCallback((targetPlanId) => {
    if (!targetPlanId) return;
    if (isDirty && !window.confirm('저장되지 않은 변경사항이 있습니다. 정말 이동하시겠습니까?')) {
      return;
    }
    navigate(`/myplan/${targetPlanId}`);
  }, [isDirty, navigate]);

  // 데이터 로딩
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        await Promise.all([
          fetchAllPlanIds(),
          fetchCartItems(),
          planId ? fetchPlanDetail(planId) : Promise.resolve(),
        ]);
      } catch (error) {
        console.error('데이터 로딩 중 오류:', error);
      } finally {
        if (mounted) setPageLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [planId]);

  // 새 플랜 플래그 반영
  useEffect(() => {
    if (!planId) return;
    if (isNewPlan) setIsEditMode(true);
    else setIsEditMode(false);
  }, [planId, isNewPlan]);

  /** ---------- 파생 정보 ---------- */
  const planDurationStr = `${Math.max(0, enabledDays - 1)}박 ${enabledDays}일`;
  const SLOT_HEIGHT_PX = 90;

  const timeSlots = useMemo(() => {
    const arr = [];
    for (let h = SLOT_START_HOUR; h < SLOT_END_HOUR; h++) {
      arr.push(`${String(h).padStart(2, '0')}:00`);
    }
    return arr;
  }, []);

  /** ---------- DnD ---------- */
  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;
    if (!over) return;

    const origin = active.data.current?.origin;

    // ✅ 숙소도 드래그 허용
    if (origin === 'cart' || origin === 'lodging') {
      const draggedItem = cartItems.find(item => item.cartId === active.id);
      if (!draggedItem) return;

      const [day] = over.id.split('-');
      setTimeModal({
        isOpen: true,
        step: 'start',
        draggedItem,
        targetDay: day,
        selectedStartTime: null,
      });
      return;
    }

    if (origin === 'schedule') {
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
        ns[originalDay] = (ns[originalDay] || []).filter(item => item.id !== movedItem.id);
        ns[newDay] = [...(ns[newDay] || []), updatedItem];
        return ns;
      });
      setIsDirty(true);
    }
  }, [cartItems, dailySchedules]);

  /** ---------- 시간 선택 모달 ---------- */
  const handleTimeConfirm = useCallback((selectedTime) => {
    const { step, draggedItem, targetDay, selectedStartTime } = timeModal;

    if (step === 'start') {
      setTimeModal(prev => ({ ...prev, step: 'end', selectedStartTime: selectedTime }));
      return;
    }

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

    setCartItems(prev => {
      const isLodging = (draggedItem.category || '').includes('숙소') || draggedItem.category === '숙소';
      return isLodging ? prev : prev.filter(item => item.cartId !== draggedItem.cartId);
    });

    setTimeModal({ isOpen: false, step: 'start', draggedItem: null, targetDay: null, selectedStartTime: null });
    setIsDirty(true);
  }, [timeModal, dailySchedules]);

  const handleTimeModalClose = useCallback(() => {
    setTimeModal({ isOpen: false, step: 'start', draggedItem: null, targetDay: null, selectedStartTime: null });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuState(prev => ({ ...prev, visible: false }));
  }, []);

  const handleContextMenu = useCallback((event, item, day) => {
    event.preventDefault();
    if (!isEditMode || !item || !day) return;

    setMenuState({
      visible: true,
      position: { x: event.clientX, y: event.clientY },
      selectedItem: item,
      day: day,
      contextType: 'schedule',
    });
  }, [isEditMode]);

  const handleLodgingContextMenu = useCallback((event, item) => {
    event.preventDefault();
    if (!item?.cartId) return;
    
    if (window.confirm(`'${item.placeName}' 항목을 카트에서 삭제하시겠습니까?`)) {
      setCartItems(prev => prev.filter(i => i.cartId !== item.cartId));
      setIsDirty(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = () => closeMenu();
    if (menuState.visible) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [menuState.visible, closeMenu]);

  const handleDeleteItem = useCallback(() => {
    const { selectedItem, day } = menuState;
    if (!selectedItem || !day) return;

    setDailySchedules(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(item => item.id !== selectedItem.id)
    }));

    // ✅ 숙소는 복귀하지 않음
    const isLodging = selectedItem.category === '숙소' || selectedItem.category?.includes('숙소');
    if (!isLodging && selectedItem.cartId) {
      const cartItem = {
        cartId: selectedItem.cartId,
        placeName: selectedItem.name,
        category: selectedItem.category,
        price: selectedItem.cost,
      };
      setCartItems(prev => [...prev, cartItem]);
    }

    setIsDirty(true);
    closeMenu();
  }, [menuState, closeMenu]);

  const handleViewDetails = useCallback(() => {
    const { selectedItem } = menuState;
    if (!selectedItem) return;
    alert(`'${selectedItem.name}'의 상세 보기 페이지로 이동합니다.`);
    closeMenu();
  }, [menuState, closeMenu]);

  useEffect(() => {
    if (menuState.visible) {
      const handleClickOutside = () => closeMenu();
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [menuState.visible, closeMenu]);

  // 사용 예산 계산
  useEffect(() => {
    const allScheduleItems = Object.values(dailySchedules).flat();
    const totalCost = allScheduleItems.reduce((sum, item) => sum + (item.cost || 0), 0);
    setPlanDetails(prev => ({ ...prev, usedBudget: totalCost }));
  }, [dailySchedules]);

  // 예산
  const handleBudgetClick = useCallback(() => {
    setBudgetInput(planDetails.totalBudget);
    setIsEditingBudget(true);
  }, [planDetails.totalBudget]);
  const handleBudgetChange = useCallback((e) => setBudgetInput(e.target.value), []);
  const handleBudgetBlur = useCallback(() => {
    const newTotalBudget = parseInt(budgetInput, 10) || 0;
    setPlanDetails(prev => ({ ...prev, totalBudget: newTotalBudget }));
    setIsEditingBudget(false);
    setIsDirty(true);
  }, [budgetInput]);
  const handleBudgetKeyDown = useCallback((e) => { if (e.key === 'Enter') handleBudgetBlur(); }, [handleBudgetBlur]);

  // 제목
  const handleTitleClick = useCallback(() => { setTitleInput(planDetails.title); setIsEditingTitle(true); }, [planDetails.title]);
  const handleTitleChange = useCallback((e) => setTitleInput(e.target.value), []);
  const handleTitleBlur = useCallback(() => {
    setPlanDetails(prev => ({ ...prev, title: titleInput }));
    setIsEditingTitle(false);
    setIsDirty(true);
  }, [titleInput]);
  const handleTitleKeyDown = useCallback((e) => { if (e.key === 'Enter') handleTitleBlur(); }, [handleTitleBlur]);

  /** ---------- 저장 ---------- */
  const handleSave = async () => {
    const places = [];
  
    Object.entries(dailySchedules).forEach(([day, items]) => {
      const dayNumber = Number(String(day).replace('Day ', '')) || Number(day);
      (items || []).forEach((item) => {
        if (!item?.time || (!item.cartId && !item.placeId)) {
          console.warn("저장 제외 (ID 정보 부족):", item);
          return;
        }
        
        const [h, m] = item.time.split(':').map(Number);
        const startMinutes = h * 60 + m;
        const endMinutes = startMinutes + Math.round((item.duration || 1) * 60);
        const toHHMM = (mins) => {
          const clampedMins = Math.max(0, Math.min(1439, mins));
          const H = String(Math.floor(clampedMins / 60)).padStart(2, '0');
          const M = String(clampedMins % 60).padStart(2, '0');
          return `${H}:${M}`;
        };
        const startTime = toHHMM(startMinutes);
        const endTime = toHHMM(endMinutes);
  
        const placeData = {
          cost: item.cost || 0,
          dayNumber,
          startTime,
          endTime,
        };
  
        if (item.placeId) {
          placeData.placeId = item.placeId;
        } else {
          placeData.cartId = item.cartId;
        }
        
        places.push(placeData);
      });
    });
  
    if (!places.length) return alert('스케줄에 추가된 일정이 없습니다!');
    if (!planId) return alert('계획 ID가 없습니다.');
  
    const payload = {
      title: planDetails?.title || '새 여행 계획',
      // ✨ 핵심 수정: '총예산' 대신 계산된 '사용 예산'을 전송
      totalPrice: Number(planDetails?.usedBudget || 0),
      places,
    };
  
    try {
      await api.patch(`/plans/${planId}`, payload);
  
      const scheduledCartIds = new Set(
          Object.values(dailySchedules).flat().map(p => p.cartId).filter(Boolean)
      );
        
      const itemsToDelete = cartItems.filter(item =>
        scheduledCartIds.has(item.cartId) &&
        !(item.category === '숙소' || item.category?.includes('숙소'))
      );
      if (itemsToDelete.length > 0) {
        await Promise.all(itemsToDelete.map(item =>
          api.delete(`/cart/${item.cartId}`)
        ));
      }
  
      alert('여행 계획이 저장되었습니다.');
      setIsEditMode(false);
      setIsDirty(false);
      setCartItems(prev =>
        prev.filter(item =>
          !(scheduledCartIds.has(item.cartId) &&
            !(item.category === '숙소' || item.category?.includes('숙소')))
        )
      );
      fetchPlanDetail(planId);
  
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      console.error('ERROR:', e?.response || e);
      alert(`저장 실패! ${msg}`);
    }
  };

  const handleEdit = useCallback(() => setIsEditMode(true), []);

  // context menu 항목 분기
  const menuItems = useMemo(() => {
    if (menuState.contextType === 'lodging') {
      return [
        {
          action: () => {
            if (menuState.selectedItem?.cartId) {
              alert('dl 카트를 삭제할까요.'); // 일정카트처럼 안내 문구
              setCartItems(prev => prev.filter(i => i.cartId !== menuState.selectedItem.cartId));
              setIsDirty(true);
              closeMenu();
            }
          }
        }
      ];
    }
    return [
      { label: '일정 상세보기', action: handleViewDetails },
      { label: '삭제하기', action: handleDeleteItem },
    ];
  }, [menuState, handleViewDetails, handleDeleteItem, closeMenu]);

  // 로딩 화면
  if (pageLoading) {
    return (
      <div className="myplan-page-container">
        <Header />
        <div className="loading-box">페이지를 불러오는 중…</div>
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd} disabled={!isEditMode}>
      <Header />
      <div className='myplan-page-container'>
        {isEditMode ? (
          <LodgingCart 
            cartItems={cartItems}
            isEditMode={isEditMode}
            onContextMenu={handleLodgingContextMenu}
          />
        ) : (
          <div className="side-card-container-placeholder"></div>
        )}

        <div className="center-column">
          <div className='schedule-header'>
            <div className="plan-sequence">
              <button
                className="plan-nav-arrow"
                onClick={() => navigateToPlan(prevPlanId)}
                disabled={!prevPlanId}
              >
                &lt;
              </button>

              <span className='plan-breadcrumb'>
                {planDetails.title || '새 여행 계획'}
              </span>

              <button
                className="plan-nav-arrow"
                onClick={() => navigateToPlan(nextPlanId)}
                disabled={!nextPlanId}
              >
                &gt;
              </button>
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
              enabledDays={enabledDays}
              onAddDay={handleAddDay}
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
          ? <ScheduleCart cartItems={cartItems.filter(item => !(item.category === '숙소' || item.category?.includes('숙소')))} dailySchedules={dailySchedules} />
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
