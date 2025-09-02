import React from "react";
import "../../css/common/PlanList.css";
import MyPlan from "../mypage/Myplan";


const PlanList = ({ plans, onPlanClick }) => {
  return (
    <>
      <div className="plan-list-container">
        <MyPlan />
      </div>
    </>
  );
};
export default PlanList;
