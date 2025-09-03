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
  if (!isValidDate(start) || !isValidDate(end)) return "";
  const ms = new Date(end) - new Date(start);
  const days = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1); // 날짜 포함
  const nights = Math.max(0, days - 1);
  return `${nights}박 ${days}일`;
};

const orderLabel = (i) => `${i + 1}번째 플랜`;

const MyPlan = ({ onClose }) => {
  const [plans, setPlans] = useState([]);
  const [revealId, setRevealId] = useState(null); // 화살표 hover 시 열릴 카드 id
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/plans");
        const list = Array.isArray(res.data) ? res.data : [];
        const normalized = list.map((p) => ({
          ...p,
          id: p.planId ?? p.id,
          title: p.title ?? "제목 없음",
          totalBudget: toNumber(p.totalBudget ?? p.totalPrice),
          startDate: p.startDate ?? p.periodStart ?? null,
          endDate: p.endDate ?? p.periodEnd ?? null,
          maxBudget: toNumber(p.maxBudget ?? 800000),
          thumbnailUrl:
            p.thumbnailUrl ||
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='80'><rect width='100%' height='100%' fill='%23eef2ff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='12'>No Image</text></svg>",
        }));
        setPlans(normalized);
      } catch (e) {
        console.error(e);
        setPlans([]);
      }
    })();
  }, []);

  const handleAddPlanClick = () => {
    onClose?.();
    navigate("/myplan");
  };

  const handleReveal = (id) => setRevealId(id);
  const handleHide = () => setRevealId(null);

  const handleDelete = async (id) => {
    if (!window.confirm("이 여행 계획을 삭제할까요?")) return;
    try {
      await api.delete(`/plans/${id}`);
      setPlans((prev) => prev.filter((p) => (p.planId ?? p.id) !== id));
      setRevealId(null);
    } catch (e) {
      console.error(e);
      alert("삭제에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="myplan-container">
      {plans.map((plan, idx) => {
        const current = toNumber(plan.totalBudget);
        const max = plan.maxBudget || 800000;
        const ratio = max > 0 ? current / max : 0;
        const pct = Math.min(100, Math.max(0, Math.round(ratio * 100)));
        const id = plan.id ?? idx;

        return (
          <section key={id} className="plan-section">
            <p className="section-label">{orderLabel(idx)}</p>

            {/* 카드: 트랙(내용) + 액션 패널 */}
            <div
              className={`plan-card ${revealId === id ? "is-reveal" : ""}`}
              onMouseLeave={handleHide}
            >
              {/* 좌/우 내용이 들어있는 트랙 - 왼쪽 슬라이드 */}
              <div className="card-track">
                <div className="plan-card-left">
                  <img className="plan-thumb" src={plan.thumbnailUrl} alt="플랜 썸네일" />
                  <div className="plan-title-box">
                    <div className="plan-title">{plan.title}</div>
                    <div className="plan-subtitle">
                      {isValidDate(plan.startDate) && isValidDate(plan.endDate)
                        ? nightsDays(plan.startDate, plan.endDate)
                        : "당일치기"}
                    </div>
                  </div>
                </div>

                <div className="plan-card-right">
                  <div className="budget-area">
                    <div
                      className="budget-badge"
                      style={{ left: `calc(${pct}% - 4.2rem)` }} /* rem 보정 */
                    >
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
                    onMouseEnter={() => handleReveal(id)} // 화살표에 올리면 열림
                    onFocus={() => handleReveal(id)}       // 키보드 접근성
                  >
                    <img
                      src={ArrowRightIcon}
                      alt="arrow right"
                      style={{ width: "2rem", height: "2rem" }}
                    />
                  </button>
                </div>
              </div>

              {/* 오른쪽 액션 패널 */}
              <div
                className="card-actions"
                onMouseEnter={() => handleReveal(id)} // 버튼 위에서도 열림 유지
              >
                <button className="action-btn danger" onClick={() => handleDelete(id)}>
                  삭제하기
                </button>
                <button
                  className="action-btn primary"
                  onClick={() => navigate(`/myplan/${id}`)}
                >
                  계획보기
                </button>
              </div>
            </div>
          </section>
        );
      })}

      <div className="add-card" onClick={handleAddPlanClick} role="button" tabIndex={0}>
        <div className="add-circle">+</div>
      </div>
    </div>
  );
};

export default MyPlan;
