import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BudgetSlider from "../main/BudgetSlider";
import api from "../../api/axios"
import { ReactComponent as People } from "../../images/main/second/people.svg";
import { ReactComponent as BasicPeople } from "../../images/main/second/basic_people.svg";
import { ReactComponent as PlanButton } from "../../images/main/second/planbutton.svg";
import jejuOceanImg from "../../images/main/jejuocean.png";

import "../../css/aiplan/PlanFormSection.css";

const PlanFormSection = () => {
  const navigate = useNavigate();
  
  const [budget, setBudget] = useState([2500000]);
  const [tripDuration, setTripDuration] = useState(null);
  const [isDurationPickerVisible, setIsDurationPickerVisible] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const durationOptions = ["당일치기", "1박 2일", "2박 3일", "3박 4일"];

  // 기간을 숫자로 변환하는 함수
  const convertDurationToNumber = (duration) => {
    const durationMap = {
      "당일치기": 1,
      "1박 2일": 2,
      "2박 3일": 3,
      "3박 4일": 4
    };
    return durationMap[duration] || 1;
  };

  // API 호출 함수
  const handlePlanSubmit = async () => {
    // 유효성 검사
    if (!planTitle.trim()) {
      alert("플랜 이름을 입력해주세요.");
      return;
    }
    
    if (!tripDuration) {
      alert("여행 기간을 선택해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const requestData = {
        planTitle: planTitle.trim(),
        budget: budget[0], // 슬라이더에서 배열로 오므로 첫 번째 값 사용
        duration: convertDurationToNumber(tripDuration)
      };

      console.log("전송할 데이터:", requestData);

      // API 호출 (이미지에서 보인 엔드포인트 사용)
      const response = await api.post("/api/ai/plans", requestData);
      
      console.log("API 응답:", response.data);
      
      // 성공 시 다음 페이지로 이동
      if (response.data && response.data.planId) {
        // 응답 데이터 구조에 맞게 처리
        const { planId, plan } = response.data;
        
        // MyPlanPage로 바로 이동하면서 AI 생성 데이터를 전달
        navigate(`/myplan/${planId}`, { 
          state: { 
            isNewPlan: true,
            isAIPlan: true, // AI로 생성된 플랜임을 표시
            planId: planId,
            planData: plan,
            planTitle: planTitle,
            budget: budget[0],
            duration: tripDuration,
            totalUsedCost: plan.totalUsedCost,
            days: plan.days
          } 
        });
      } else {
        alert("플랜 생성은 완료되었지만 데이터를 불러올 수 없습니다.");
      }
      
    } catch (error) {
      console.error("플랜 생성 실패:", error);
      
      if (error.response) {
        // 서버 응답이 있는 경우
        const errorMessage = error.response.data?.message || "플랜 생성에 실패했습니다.";
        alert(errorMessage);
        console.log("서버 응답 에러:", error.response.data);
      } else if (error.request) {
        // 요청이 전송되었지만 응답을 받지 못한 경우
        alert("서버와 통신할 수 없습니다. 네트워크를 확인해주세요.");
        console.log("네트워크 에러:", error.request);
      } else {
        // 요청 설정 중 에러가 발생한 경우
        alert("요청 처리 중 오류가 발생했습니다.");
        console.log("기타 에러:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="plan-form-wrapper">
      <div className="plan-form-left">
        <div className="plan-title-card">
          <h2>예산과 일정을 입력해주세요</h2>
        </div>

        <BudgetSlider budget={budget} setBudget={setBudget} />

        <div className="selector-container">
          <div
            className="selector-row"
            onClick={() => setIsDurationPickerVisible(!isDurationPickerVisible)}
          >
            {tripDuration ? (
              <People className="icon" />
            ) : (
              <BasicPeople className="icon" />
            )}
            <span className={!tripDuration ? "placeholder" : ""}>
              {tripDuration || "여행 기간"}
            </span>
          </div>

          {isDurationPickerVisible && (
            <div className="selector-options">
              {durationOptions.map((option) => (
                <div
                  key={option}
                  className={`selector-option-item ${
                    tripDuration === option ? "selected" : ""
                  }`}
                  onClick={() => {
                    setTripDuration(option);
                    setIsDurationPickerVisible(false);
                  }}
                >
                  <People className="icon" />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 플랜 이름 입력란 */}
        <div className="plan-title-input-wrapper">
          <input
            type="text"
            className="plan-title-input"
            placeholder="플랜 이름을 작성하세요"
            value={planTitle}
            onChange={(e) => setPlanTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button 
          className="plan-submit"
          onClick={handlePlanSubmit}
          disabled={isLoading}
        >
          {isLoading ? "플랜 생성 중..." : "플랜 생성"}
          <PlanButton className="icon" />
        </button>

        <div 
          className="plan-direct" 
          onClick={() => !isLoading && navigate("/schedule")}
          style={{ opacity: isLoading ? 0.5 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          직접 계획할래요
        </div>
      </div>

      <div className="plan-form-right">
        <div className="plan-image-box">
          <img
            src={jejuOceanImg}
            alt="JEJU a beautiful island"
            className="plan-image"
          />
          <div className="plan-image-title">
            <div>JEJU,</div>
            <div>a beautiful island</div>
            <span className="plan-title-bar"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanFormSection;