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
const SLOT_END_HOUR = 23; // 마지막 표시시간 (종료 상한)
const toSlotIndex = (time) => {
  const [h] = String(time || '08:00').split(':').map(Number);
  return h - SLOT_START_HOUR; // 08:00 -> 0, 09:00 -> 1 ...
};
const isOverlapping = (newSchedule, existingSchedules) => {
  const newStart = toSlotIndex(newSchedule.time);
  const newEnd = newStart + Math.round(newSchedule.duration); // duration은 시간 단위
  return (existingSchedules || []).some(existing => {
    if (existing.id === newSchedule.id) return false;
    const existStart = toSlotIndex(existing.time);
    const existEnd = existStart + Math.round(existing.duration);
    return !(newEnd <= existStart || newStart >= existEnd);
  });
};

/** ---------- 페이지 ---------- */
const MyPlanPage = () => {
  const { planId: planIdParam } = useParams(); // /myplan/:planId
  const planId = String(planIdParam ?? '');     // ✅ 문자열 정규화
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

      setPlanDetails({
        id: String(data.id ?? data.planId ?? id),  // ✅ 문자열 정규화
        title: data.title ?? '',
        author: data.username ?? '',
        totalBudget: data.totalPrice ?? 0,
        usedBudget: (data.places || []).reduce((sum, p) => sum + (p.cost || 0), 0),
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
      // ✅ 모든 id를 문자열로 정규화
      const ids = (res.data || [])
        .map(plan => String(plan.id ?? plan.planId))
        .filter(Boolean);
      setAllPlanIds(prev => {
        // 현재 보고 있는 planId가 목록에 없다면 포함시켜 prev/next 보장
        const cur = String(planId || '');
        if (cur && !ids.includes(cur)) return [...ids, cur];
        return ids;
      });
    } catch (e) {
      console.error("전체 계획 목록을 불러오지 못했습니다.", e);
      // 그래도 현재 planId는 포함
      setAllPlanIds(prev => {
        const cur = String(planId || '');
        if (cur && !prev.includes(cur)) return [...prev, cur];
        return prev;
      });
    }
  };

  // prev/next 계산 (문자열 기준)
  const { prevPlanId, nextPlanId } = useMemo(() => {
    const currentIndex = allPlanIds.indexOf(String(planId));
    if (currentIndex === -1) {
      return { prevPlanId: null, nextPlanId: null };
    }
    const prev = currentIndex > 0 ? allPlanIds[currentIndex - 1] : null;
    const next = currentIndex < allPlanIds.length - 1 ? allPlanIds[currentIndex + 1] : null;
    return { prevPlanId: prev, nextPlanId: next };
  }, [allPlanIds, planId]);

  // 다른 계획으로 이동하는 함수
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
    if (isNewPlan) setIsEditMode(true);   // 새 플랜이면 편집
    else setIsEditMode(false);            // 그 외는 보기
}, [planId, isNewPlan]);
    

  /** ---------- 파생 정보 ---------- */
  const activeDayCount = useMemo(
    () => Object.values(dailySchedules).filter(daySchedule => (daySchedule || []).length > 0).length,
    [dailySchedules]
  );
  // ✅ 기본 0박 0일
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
  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;
    if (!over) return;

    const origin = active.data.current?.origin;

    // 숙소 카드는 드래그 불가 정책
    if (origin === 'lodging') return;

    if (origin === 'cart') {
      const draggedItem = cartItems.find(item => item.cartId === active.id);
      if (!draggedItem) return;

      const [day] = over.id.split('-'); // 'Day 1-09:00' → 'Day 1'
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
    setCartItems(prev => prev.filter(item => item.cartId !== draggedItem.cartId));

    setTimeModal({ isOpen: false, step: 'start', draggedItem: null, targetDay: null, selectedStartTime: null });
    setIsDirty(true);
  }, [timeModal, dailySchedules]);

  const handleTimeModalClose = useCallback(() => {
    setTimeModal({ isOpen: false, step: 'start', draggedItem: null, targetDay: null, selectedStartTime: null });
  }, []);

  /** ---------- 컨텍스트 메뉴 ---------- */
  const closeMenu = useCallback(() => {
    setMenuState(prev => ({ ...prev, visible: false }));
  }, []);

  const handleContextMenu = useCallback((event, item, day) => {
    event.preventDefault();
    // 우클릭 위치에 띄우는 기본형 (원하면 카드 기준 위치로 변경 가능)
    setMenuState({
      visible: true,
      position: { x: event.clientX + window.scrollX, y: event.clientY + window.scrollY },
      selectedItem: item,
      day,
    });
  }, []);

  const handleDeleteItem = useCallback(() => {
    const { selectedItem, day } = menuState;
    if (!selectedItem || !day) return;

    setDailySchedules(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(item => item.id !== selectedItem.id)
    }));

    // cartId가 있는 일정이면 카트로 복귀
    if (selectedItem.cartId) {
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
  }, [menuState]);

  const handleViewDetails = useCallback(() => {
    const { selectedItem } = menuState;
    if (!selectedItem) return;
    alert(`'${selectedItem.name}'의 상세 보기 페이지로 이동합니다.`);
    closeMenu();
  }, [menuState]);

  useEffect(() => {
    if (menuState.visible) {
      const handleClickOutside = () => closeMenu();
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [menuState.visible, closeMenu]);

  // 사용 예산 계산
  useEffect(() => {
    // 스케줄에 추가된 일정들의 비용
    const allScheduleItems = Object.values(dailySchedules).flat();
    const scheduleCost = allScheduleItems.reduce((sum, item) => sum + (item.cost || 0), 0);
    
    // 숙소 카드들의 비용 (활성화된 날짜 수만큼 곱하기)
    const lodgingItems = cartItems.filter(item => 
      item.category === '숙소' || item.category?.includes('숙소')
    );
    const activeDayCount = Object.values(dailySchedules).filter(daySchedule => 
      (daySchedule || []).length > 0
    ).length;
    
    const lodgingCost = lodgingItems.reduce((sum, item) => {
      return sum + ((item.price || 0) * Math.max(1, activeDayCount - 1)); // n박은 n-1일
    }, 0);
    
    const totalCost = scheduleCost + lodgingCost;
    setPlanDetails(prev => ({ ...prev, usedBudget: totalCost }));
  }, [dailySchedules, cartItems]);

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
/** ---------- 저장 ---------- */
const handleSave = async () => {
  const places = [];

  // 기존 스케줄에 추가된 일정들 처리
  Object.entries(dailySchedules).forEach(([day, items]) => {
    const dayNumber = Number(String(day).replace('Day ', '')) || Number(day);

    (items || []).forEach((item) => {
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

      // 0분 구간 방지
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
  

  // 숙소 카드들을 자동으로 각 날짜에 추가
  const lodgingItems = cartItems.filter(item => 
    item.category === '숙소' || item.category?.includes('숙소')
  );

  console.log('저장 시 숙소 아이템들:', lodgingItems);

  // 활성화된 날짜들 가져오기 (스케줄이 있는 날들)
  const activeDays = Object.entries(dailySchedules)
    .filter(([day, items]) => (items || []).length > 0)
    .map(([day]) => Number(String(day).replace('Day ', '')) || Number(day))
    .sort((a, b) => a - b);

  console.log('활성화된 날짜들:', activeDays);

  // 숙소가 있고 활성화된 날짜가 있으면 각 날짜에 숙소 추가
  if (lodgingItems.length > 0 && activeDays.length > 0) {
    lodgingItems.forEach(lodgingItem => {
      activeDays.forEach(dayNumber => {
        places.push({
          cartId: lodgingItem.cartId,
          dayNumber,
          startTime: "23:00:00", // 숙소는 23:00부터
          endTime: "23:59:00",   // 23:59까지로 설정
        });
      });
    });
  }

  console.log('저장할 places:', places);

  if (!places.length) return alert('스케줄에 추가된 일정이 없습니다!');
  if (!planId) return alert('유효하지 않은 접근입니다. 계획 ID가 없습니다.');

  const payload = {
    title: planDetails?.title || '새 여행 계획',
    totalPrice: Number(planDetails?.totalBudget || 0),
    places, // cartId 기반 (스케줄 일정 + 숙소)
  };

  try {
    await api.patch(`/plans/${planId}`, payload);
    alert('여행 계획이 성공적으로 저장되었습니다.');
    setIsEditMode(false);
    setIsDirty(false);
    
    
    
  } catch (e) {
    const msg = e?.response?.data?.message || e.message;
    console.error('ERROR:', e?.response || e);
    alert(`저장 실패! ${msg}`);
  }
};
const handleLodgingDelete = useCallback((cartId) => {
  setCartItems(prev => prev.filter(item => item.cartId !== cartId));
}, []);
  const handleEdit = useCallback(() => setIsEditMode(true), []);

  const menuItems = useMemo(() => [
    { label: '일정 상세보기', action: handleViewDetails },
    { label: '삭제하기', action: handleDeleteItem },
  ], [handleViewDetails, handleDeleteItem]);

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
        <LodgingCart 
          cartItems={cartItems} 
          isEditMode={isEditMode}
          dailySchedules={dailySchedules}
          onDelete={handleLodgingDelete}
        />
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
