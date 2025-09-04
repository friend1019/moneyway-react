import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/mypage/MyPlan.css";
import ArrowRightIcon from "../../images/myplan/right-arrow.svg";

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
  const s = new Date(start);
  const e = new Date(end);
  const sKR = s.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
  const eKR = e.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
  return `${sKR} ~ ${eKR}`;
};
const nightsDays = (start, end) => {
  if (!isValidDate(start) || !isValidDate(end)) return "일정 미정";
  const ms = new Date(end) - new Date(start);
  const days = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
  const nights = Math.max(0, days - 1);
  return `${nights}박 ${days}일`;
};
const orderLabel = (i) => `${i + 1}번째 플랜`;

const MyPlan = ({ onClose }) => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [revealId, setRevealId] = useState(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get("/plans");
      const list = Array.isArray(res.data) ? res.data : [];

      const normalized = list.map((p, idx) => {
        const id = p.id ?? p.planId ?? idx;
        const totalBudget = toNumber(p.totalBudget ?? p.totalPrice);
        const maxBudget = toNumber(p.maxBudget ?? 800000);

        return {
          ...p,
          id,
          title: p.title ?? "제목 없음",
          totalBudget,
          maxBudget,
          startDate: p.startDate ?? p.periodStart ?? null,
          endDate: p.endDate ?? p.periodEnd ?? null,
          thumbnailUrl:
            p.thumbnailUrl ||
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='80'><rect width='100%' height='100%' fill='%23eef2ff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='12'>No Image</text></svg>",
        };
      });

      setPlans(normalized);
    } catch (e) {
      console.error("GET /plans 실패:", e);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleAddPlanClick = async () => {
    try {
      onClose?.();
      const res = await api.post("/plans/empty");
      const newPlanId = res?.data?.id ?? res?.data?.planId;
      if (!newPlanId) {
        alert("생성된 여행 계획 ID를 확인할 수 없습니다.");
        return;
      }
      navigate(`/myplan/${newPlanId}`, { state: { isNewPlan: true } });
    } catch (e) {
      console.error("POST /plans/empty 실패:", e);
      alert("새 여행 계획을 만들 수 없어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("이 여행 계획을 삭제할까요?")) return;
    try {
      await api.delete(`/plans/${id}`);
      setPlans((prev) => prev.filter((p) => (p.id ?? p.planId) !== id));
      setRevealId(null);
    } catch (e) {
      console.error("DELETE /plans/{id} 실패:", e);
      alert("삭제에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleReveal = (id) => setRevealId(id);
  const handleHide = () => setRevealId(null);
  const handleToggleReveal = (id) => setRevealId(prev => (prev === id ? null : id));

  return (
    <div className="myplan-container">
      {loading && <div className="plan-loading">불러오는 중…</div>}
      {!loading && plans.length === 0 && (
        <p className="plan-empty-text">아직 저장된 여행 계획이 없어요.</p>
      )}

      {plans.map((plan, idx) => {
        const current = toNumber(plan.totalBudget);
        const max = toNumber(plan.maxBudget);
        const ratio = max > 0 ? current / max : 0;
        const pct = Math.min(100, Math.max(0, Math.round(ratio * 100)));
        const id = plan.id ?? idx;
        const badgeLeft = Math.min(96, Math.max(4, pct));

        return (
          <section key={id} className="plan-section">
            <p className="section-label">{orderLabel(idx)}</p>

            <div
              className={`plan-card ${revealId === id ? "is-reveal" : ""}`}
              onMouseLeave={handleHide}
            >
              <div className="card-track">
                <div className="plan-card-left">
                  <img className="plan-thumb" src={plan.thumbnailUrl} alt="플랜 썸네일" />
                  <div className="plan-title-box">
                    <div className="plan-title">{plan.title}</div>

                    {/* ⬇ 저장된 기간을 그대로 사용 */}
                    <div className="plan-subtitle">
                      {nightsDays(plan.startDate, plan.endDate)}
                    </div>
                    <div className="plan-dates">
                      {formatDateRange(plan.startDate, plan.endDate)}
                    </div>
                  </div>
                </div>

                <div className="plan-card-right">
                  <div className="budget-area">
                    <div className="budget-badge" style={{ left: `calc(${badgeLeft}% - 4.2rem)` }}>
                      ₩ {current.toLocaleString("ko-KR")}
                    </div>

                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${pct}%` }} />
                      <div className="bar-base" />
                    </div>

                    <div className="budget-meta">
                      <span className="meta-left">예산</span>
                      <span className="meta-right">₩ {max.toLocaleString("ko-KR")}</span>
                    </div>
                  </div>

                  <button
                    className="chevron-btn"
                    aria-label="액션 열기"
                    aria-expanded={revealId === id}
                    onMouseEnter={() => handleReveal(id)}
                    onFocus={() => handleReveal(id)}
                    onClick={() => handleToggleReveal(id)}
                  >
                    <img
                      src={ArrowRightIcon}
                      alt="arrow right"
                      style={{ width: "2rem", height: "2rem" }}
                    />
                  </button>
                </div>
              </div>

              <div className="card-actions" onMouseEnter={() => handleReveal(id)}>
                <button className="action-btn danger" onClick={() => handleDelete(id)}>
                  삭제하기
                </button>
                <button
                  className="action-btn primary"
                  onClick={() => navigate(`/myplan/${id}`, { state: { isNewPlan: false } })}
                >
                  계획보기
                </button>
              </div>
            </div>
          </section>
        );
      })}

      <div
        className="add-card"
        onClick={handleAddPlanClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" ? handleAddPlanClick() : null)}
        aria-label="새 여행 계획 만들기"
        title="새 여행 계획 만들기"
      >
        <div className="add-circle">+</div>
      </div>
    </div>
  );
};

export default MyPlan;
