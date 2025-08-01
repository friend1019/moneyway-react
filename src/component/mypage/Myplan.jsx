import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/mypage/MyPlan.css";

const MyPlan = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/plans");
        setPlans(res.data);
      } catch (error) {
        console.error("여행 계획 불러오기 실패:", error);
      }
    };

    fetchPlans();
  }, []);

  const formatDateRange = (start, end) => {
    if (!start || !end) return "일정 미정";
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

  return (
    <div className="myplan-container">
      {plans.map((plan, index) => (
        <div className="plan-card" key={plan.planId}>
          <div className="plan-info">
            <img src={plan.thumbnailUrl} alt="썸네일" className="thumbnail" />
            <div>
              <div className="plan-title">{plan.title}</div>
              <div className="plan-date">{formatDateRange(plan.startDate, plan.endDate)}</div>
            </div>
          </div>
          <div className="plan-budget">
            <div className="budget-bar">
              <div
                className="budget-fill"
                style={{
                  width: `${(plan.totalBudget / 800000) * 100}%`,
                }}
              />
            </div>
            <div className="budget-labels">
              <span>예산</span>
              <span>₩ {plan.totalBudget.toLocaleString()}</span>
              <span>/ ₩ 800,000</span>
            </div>
          </div>
        </div>
      ))}

      <div className="add-plan-box" onClick={() => navigate("/schedule")}>
        <div className="plus-icon">+</div>
      </div>
    </div>
  );
};

export default MyPlan;
