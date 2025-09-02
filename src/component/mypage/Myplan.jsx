import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/mypage/MyPlan.css";

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const isValidDate = (v) => {
  if (!v) return false;
  const d = new Date(v);
  return !Number.isNaN(d.getTime());
};

const formatDateRange = (start, end) => {
  if (!isValidDate(start) || !isValidDate(end)) return "일정 미정";
  const startDate = new Date(start).toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
  const endDate = new Date(end).toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
  return `${startDate} ~ ${endDate}`;
};

const MyPlan = ({ onClose }) => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/plans");
        const list = Array.isArray(res.data) ? res.data : [];

        const normalized = list.map((p) => ({
          ...p,
          id: p.planId ?? p.id, // 키 보정
          totalBudget: toNumber(p.totalBudget ?? p.totalPrice),
          startDate: p.startDate ?? p.periodStart ?? null,
          endDate: p.endDate ?? p.periodEnd ?? null,
          thumbnailUrl:
            p.thumbnailUrl ||
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='80'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='12'>No Image</text></svg>",
          title: p.title ?? "제목 없음",
        }));

        setPlans(normalized);
      } catch (error) {
        console.error("여행 계획 불러오기 실패:", error);
        setPlans([]); // 안전값
      }
    };

    fetchPlans();
  }, []);

  const handleAddPlanClick = () => {
    onClose?.();
    navigate("/myplan"); // ✅ 바로 MyPlanPage로
  };

  return (
    <div className="myplan-container">
      {(plans ?? []).map((plan) => {
        const budget = toNumber(plan.totalBudget);
        const base = 800_000; // 기준 예산
        const ratio = base ? budget / base : 0;
        const widthPct = Math.min(100, Math.max(0, Math.round(ratio * 100))); // 0~100 클램프

        return (
          <div className="plan-card" key={plan.id ?? plan.planId}>
            <div className="plan-info">
              {/* 썸네일 안전 처리 */}
              {plan.thumbnailUrl ? (
                <img src={plan.thumbnailUrl} alt="썸네일" className="thumbnail" />
              ) : (
                <div className="thumbnail placeholder" />
              )}
              <div>
                <div className="plan-title">{plan.title}</div>
                <div className="plan-date">
                  {formatDateRange(plan.startDate, plan.endDate)}
                </div>
              </div>
            </div>

            <div className="plan-budget">
              <div className="budget-bar">
                <div className="budget-fill" style={{ width: `${widthPct}%` }} />
              </div>
              <div className="budget-labels">
                <span>예산</span>
                <span>₩ {(budget).toLocaleString("ko-KR")}</span>
                <span>/ ₩ {base.toLocaleString("ko-KR")}</span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="add-plan-box" onClick={handleAddPlanClick}>
        <div className="plus-icon">+</div>
      </div>
    </div>
  );
};

export default MyPlan;
