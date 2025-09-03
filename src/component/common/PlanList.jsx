import React from "react";
import "../../css/common/PlanList.css";
import MyPlan from "../mypage/Myplan";
import Header from "../common/Header";
import Footer from "../common/Footer";

const PlanList = ({ plans, onPlanClick }) => {
  return (
    <>
      <Header />
      <div className="plan-list-background" style={{backgroundColor:'#f6f7fb'}}>
        <div className="plan-list-container">
          <MyPlan />
        </div>
      </div>
      <Footer />
    </>
  );
};
export default PlanList;
